import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Table,
  message,
} from 'antd';
import UploadImage from '@/components/inputs/UploadImage';
import { useRouter } from 'next/router'; // Fixed 'next/navigation' to 'next/router'
import {
  VehicleEngineType,
  VehicleInput,
  VehicleStatus,
} from '@/api/vehicles/types';
import {
  useCreateVehicle,
  useGetLastVehicleDetails,
  useUpdateVehicle,
  useVehicleById,
} from '@/api/vehicles/hooks';
import DisplayImage from '@/components/image/DisplayImage';
import styles from './CreateVehicle.module.scss';
import {
  createVehicle,
  getVehicleByRDWLicencePlate,
} from '@/api/vehicles/vehicles';
import { ColumnsType } from 'antd/es/table';
import nlJson from '@/utils/nl.json';

const timeframesTitles = [
  '00:00 T/M 6:00',
  '06:00 t/m 12:00',
  '12:00 t/m 18:00',
  '18:00 t/m 00:00',
];

const timeframesStructure = [
  {
    title: 'MA',
  },
  {
    title: 'DI',
  },
  {
    title: 'WO',
  },
  {
    title: 'DO',
  },
  {
    title: 'VR',
  },
  {
    title: 'ZA',
  },
  {
    title: 'ZO',
  },
];

const defaultTimeframes = [
  [NaN, NaN, NaN, NaN],
  [NaN, NaN, NaN, NaN],
  [NaN, NaN, NaN, NaN],
  [NaN, NaN, NaN, NaN],
  [NaN, NaN, NaN, NaN],
  [NaN, NaN, NaN, NaN],
  [NaN, NaN, NaN, NaN],
];

const dataSource: readonly object[] | undefined = [0, 1, 2, 3].map((el) => {
  return {
    key: el,
    monday: defaultTimeframes[0][el],
    tuesday: defaultTimeframes[1][el],
    wednesday: defaultTimeframes[2][el],
    thursday: defaultTimeframes[3][el],
    friday: defaultTimeframes[4][el],
    saturday: defaultTimeframes[5][el],
    sunday: defaultTimeframes[6][el],
  };
});

const initialVehicleData: VehicleInput = {
  logo: '',
  companyName: '',
  model: '',
  rentalDuration: '',
  licensePlate: '',
  category: '',
  manufactureYear: '',
  engineType: undefined,
  seatingCapacity: '',
  batteryCapacity: NaN,
  uniqueFeature: '',
  images: [],
  papers: [],
  availability: 'available',
  currency: 'EUR',
  pricePerDay: 0.0,
  status: VehicleStatus.PENDING,
  vin: '',
  timeframes: defaultTimeframes,
  streetName: '',
  streetNumber: '',
  zipcode: '',
  state: '',
  title: '',
  description: '',
};

const CreateVehicle: React.FC = () => {
  const router = useRouter();
  const isCreate = !router.query.vehicleId;
  const [searchPlate, setSearchPlate] = useState<string>('');
  const [vehicleData, setVehicleData] = useState(initialVehicleData);
  const { mutate: create, isPending: isCreating } = useCreateVehicle();
  const { mutateAsync: update } = useUpdateVehicle();

  const [form] = Form.useForm();
  const { data: vehicle } = useVehicleById(router.query.vehicleId as string);
  const { data: lastVehicleDetails } = useGetLastVehicleDetails();
  useEffect(() => {
    if (lastVehicleDetails && isCreate) {
      setVehicleData((el) => ({
        ...el,
        timeframes: lastVehicleDetails.timeframes,
      }));
    }
  }, [lastVehicleDetails]);

  const columns: ColumnsType<object> | undefined = timeframesStructure.map(
    (el, dayIndex) => ({
      title: el.title,
      key: el.title,
      align: 'center',
      render: (data) => {
        const timeframeIndex = data.key;
        const title = timeframesTitles[timeframeIndex];
        const timeframes = vehicleData.timeframes;
        const value = timeframes[dayIndex][timeframeIndex];
        // console.log(timeframes);
        return (
          <div className="flex flex-col">
            <label htmlFor="">{title}</label>
            <InputNumber
              min={0}
              onChange={(val) => {
                const newTimeFrames = timeframes?.map((el, index1) =>
                  index1 !== dayIndex
                    ? el
                    : el?.map((element, index2) => {
                        return index2 === timeframeIndex ? val || 0 : element;
                      }),
                );
                setVehicleData((el) => ({
                  ...el,
                  timeframes: newTimeFrames,
                }));
              }}
              value={value}
              addonBefore="€"
              className="w-full"
            />
          </div>
        );
      },
    }),
  );

  useEffect(() => {
    if (vehicle) {
      form.setFieldsValue(vehicle);
      if (!vehicle.timeframes) {
        return setVehicleData({
          ...initialVehicleData,
          ...vehicle,
          timeframes: initialVehicleData.timeframes,
        });
      }
      setVehicleData({ ...initialVehicleData, ...vehicle });
    }
  }, [vehicle]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setVehicleData((prevData) => ({
      ...prevData,
      ...(name === 'pricePerDay'
        ? { [name]: Number(value) }
        : { [name]: value }),
    }));
  };

  const fetchVehicleByPlate = async () => {
    try {
      const fetchedVehicle = await getVehicleByRDWLicencePlate(searchPlate);
      if (fetchedVehicle && fetchedVehicle.length > 0) {
        const vehicleInfo = fetchedVehicle[0];

        const updatedVehicleData = {
          ...vehicleData,
          companyName: vehicleInfo.merk,
          model: vehicleInfo.handelsbenaming,
          licensePlate: vehicleInfo.kenteken,
          manufactureYear:
            new Date(vehicleInfo.datum_eerste_toelating_dt)
              .getFullYear()
              .toString() || '',
          seatingCapacity: vehicleInfo.aantal_zitplaatsen,
        };

        console.log(updatedVehicleData);

        setVehicleData(updatedVehicleData);
        form.setFieldsValue(updatedVehicleData);
      } else {
        message.error('No data found for the provided plate number.');
      }
    } catch (error) {
      message.error(
        'Provide valid and unique plate number with capital alphabet',
      );
      console.error(error);
    }
  };

  function validateForm(form: VehicleInput) {
    let messageText = '';
    const timeframes = form.timeframes;
    const images = form.images;
    if (timeframes.some((day) => day.some((frame) => !frame))) {
      messageText = 'Pricing must not be empty or zero';
      message.error(messageText);
    } else if (!(images.length > 0)) {
      messageText = 'Must upload at least one image';
      message.error(messageText);
    }
    return messageText;
  }

  const handleCreateVehicle = async () => {
    try {
      const validate = validateForm(vehicleData);
      if (!!validate) return;
      vehicleData.batteryCapacity = vehicleData.batteryCapacity?.toString();
      if (router.query.vehicleId) {
        // update
        vehicleData.pricePerDay = Number(vehicleData.pricePerDay);
        // vehicleData.status = VehicleStatus.PENDING;
        await update({
          id: router.query.vehicleId as string,
          data: vehicleData,
        });
        message.success('Vehicle updated successfully');
      } else {
        const data = await create(vehicleData);
        // if (data) {
        message.success('Vehicle added successfully');
        // }
      }
      router.push('/dashboard/vehicles');
    } catch (error) {
      console.log(error);
      message.error('Error!');
    }
    router.push('/dashboard/vehicles');
  };

  const onSetPaperImageUrl = (url: string) => {
    setVehicleData((prevData) => ({
      ...prevData,
      papers: [...prevData.papers, url],
    }));
  };
  const onRemoveCarImage = (url: string) => {
    setVehicleData((prevData) => {
      console.log(url, prevData.images);
      return {
        ...prevData,
        images: prevData.images.filter((el) => el !== url),
      };
    });
  };

  console.log(vehicleData);
  const onRemovePaperImage = (url: string) => {
    setVehicleData((prevData) => ({
      ...prevData,
      papers: prevData.papers.filter((el) => el !== url),
    }));
  };
  const onSetCarImageUrl = (url: string) => {
    setVehicleData((prevData) => ({
      ...prevData,
      images: [...prevData.images, url],
    }));
  };

  const engineTypeOptions = [
    { label: 'Benzine', value: VehicleEngineType.BENZINE },
    { label: 'Hybride benzine', value: VehicleEngineType.HYBRIDE_BENZINE },
    { label: 'Diesel', value: VehicleEngineType.DIESEL },
    { label: 'Hybride diesel', value: VehicleEngineType.HYBRIDE_DIESEL },
    { label: 'Elektrisch', value: VehicleEngineType.ELEKTRISCH },
  ];

  const onSelectChange = (name: string) => {
    const handleOnChange = (value: string) => {
      setVehicleData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    return handleOnChange;
  };

  const zipcodeValidator = (rule, value, callback) => {
    if (!value) {
      return Promise.reject(new Error('Please input your zipcode!'));
    }
    if (!/^\d{4}[a-zA-Z]{2}$/.test(value)) {
      return Promise.reject(new Error('Wrong format!'));
    }
    return Promise.resolve();
  };

  const citiesOptions = nlJson.map((el) => ({ label: el, value: el }));

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <Button onClick={() => router.push('/dashboard/vehicles')}>
          terug
        </Button>
        {/* <Input
          placeholder="Search Plate Number"
          value={searchPlate}
          onChange={(e) => setSearchPlate(e.target.value)}
          className="rounded-e-none flex-1 py-6 placeholder:text-neutral-50 font-medium"
        />
        <button
          onClick={fetchVehicleByPlate}
          className="btn-primary min-w-[10rem] rounded-s-none"
        >
          <span className="font-bold">Search Vehicle</span>
        </button> */}
      </div>
      <Form
        onFinish={handleCreateVehicle}
        form={form}
        layout={'vertical'}
        initialValues={vehicleData}
        scrollToFirstError
        className="flex flex-col gap-4"
      >
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <h1 className="text-xl mb-6">Autodetails</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Item<any> label="Automerk" name="companyName" required>
              <Input
                name="companyName"
                value={vehicleData?.companyName}
                onChange={handleInputChange}
                placeholder="Bijv: Tesla"
                required
              />
            </Form.Item>
            <Form.Item<any> label="Model" name="model" required>
              <Input
                required
                name="model"
                value={vehicleData?.model}
                onChange={handleInputChange}
                placeholder="Bijv: Model 3"
              />
            </Form.Item>
            <Form.Item<any> label="Kenteken" name="licensePlate" required>
              <Input
                required
                name="licensePlate"
                value={vehicleData?.licensePlate}
                onChange={handleInputChange}
                placeholder="Bijv: 12ABCD"
              />
            </Form.Item>
            <Form.Item<any> label="VIN nummer" name="vin" required>
              <Input
                required
                name="vin"
                value={vehicleData?.vin}
                onChange={handleInputChange}
                placeholder="Bijv: 12345678910111213"
              />
            </Form.Item>
            <Form.Item<any>
              label="Motor"
              name="engineType"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                allowClear
                size="large"
                options={engineTypeOptions}
                name="engineType"
                value={vehicleData?.engineType}
                onChange={onSelectChange('engineType')}
                placeholder="Bijv: Elektrisch"
              />
            </Form.Item>
            <Form.Item<any>
              label="Actieradius"
              name="batteryCapacity"
              rules={[{ required: true, message: '' }]}
            >
              <InputNumber
                required
                size="large"
                className="w-full"
                addonAfter="KM"
                name="batteryCapacity"
                value={vehicleData?.batteryCapacity}
                onChange={onSelectChange('batteryCapacity')}
                placeholder="Bijv: 100 km"
              />
            </Form.Item>
            <Form.Item<any> label="Bouwjaar" name="manufactureYear" required>
              <Input
                required
                name="manufactureYear"
                value={vehicleData?.manufactureYear}
                onChange={handleInputChange}
                placeholder="Bijv: 12345678910111213"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Zitplaatsen" name="seatingCapacity" required>
              <Input
                required
                name="seatingCapacity"
                value={vehicleData?.seatingCapacity}
                onChange={handleInputChange}
                placeholder="Bijv: 5"
              />
            </Form.Item>
            <Form.Item<any>
              label="Titel"
              name="title"
              className="col-span-full"
              required
            >
              <Input
                required
                name="title"
                value={vehicleData?.seatingCapacity}
                onChange={handleInputChange}
                placeholder="Bij: Lorem"
              />
            </Form.Item>
            <Form.Item<any>
              label="Omschrijving"
              name="description"
              className="col-span-full"
              required
            >
              <Input.TextArea
                required
                name="description"
                value={vehicleData?.seatingCapacity}
                onChange={handleInputChange}
                placeholder="Bij: Lorem"
                rows={5}
              />
            </Form.Item>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <div className="">
            <h1 className="col-span-full text-xl">Ophaallocatie</h1>
            <div className="col-span-full grid grid-cols-2 w-full gap-2">
              <Form.Item<any>
                rules={[{ required: true, message: 'Straatnaam is required!' }]}
                label="Straatnaam"
                name="streetName"
                className="flex-1"
              >
                <Input
                  required
                  name="streetName"
                  value={vehicleData?.streetName}
                  onChange={handleInputChange}
                  placeholder="Bijv: Damstraat"
                />
              </Form.Item>
              <Form.Item<any>
                rules={[{ required: true, message: 'Huisnummer is required!' }]}
                label="Huisnummer"
                name="streetNumber"
                className="flex-1"
              >
                <Input
                  required
                  name="streetNumber"
                  value={vehicleData?.streetNumber}
                  onChange={handleInputChange}
                  placeholder="Bijv: 34"
                />
              </Form.Item>
              <Form.Item<any>
                label="Postcode"
                name="zipcode"
                className="w-full"
                rules={[
                  // {
                  //   type: 'regexp',
                  //   pattern: new RegExp('([a-zA-Z]{3,30}\\s*)+'),
                  //   required: true,
                  //   message: 'Wrong format!',
                  // },
                  {
                    validator: zipcodeValidator,
                  },
                ]}
                hasFeedback={false}
                required
              >
                <Input
                  required
                  name="zipcode"
                  value={vehicleData?.zipcodeNumber}
                  onChange={handleInputChange}
                  placeholder="Bijvoorbeed: 1234AB"
                />
              </Form.Item>
              <Form.Item<any>
                label="Plaats"
                name="state"
                className="w-full"
                required
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  showSearch
                  size="large"
                  options={citiesOptions}
                  name="state"
                  value={vehicleData?.state}
                  onChange={onSelectChange('state')}
                  placeholder="Bijv: Amsterdam"
                  allowClear
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <h3 className="text-lg">Prijzen</h3>
          <Table
            rowClassName="bg-primary-light-2"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </div>
        <div className="">
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg">Paper images</h3>
              <div>
                <Row gutter={16}>
                  {vehicleData.papers.map((image) => (
                    <Col span={6} key={image}>
                      <DisplayImage
                        imageUrl={image}
                        onImageDelete={onRemovePaperImage}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
              <div>
                <UploadImage
                  placeholder="Geuploade bestanden"
                  setImageUrl={onSetPaperImageUrl}
                />
              </div>
            </div>
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg">Upload auto afbeeldingen</h3>
              <div>
                <Row gutter={16}>
                  {vehicleData.images.map((image) => (
                    <Col span={6} key={image}>
                      <DisplayImage
                        imageUrl={image}
                        onImageDelete={onRemoveCarImage}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
              <div>
                <UploadImage
                  placeholder="Geuploade bestanden"
                  setImageUrl={onSetCarImageUrl}
                />
              </div>
            </div>
            <div>
              <Button
                htmlType="submit"
                // onClick={handleCreateVehicle}
                loading={isCreating}
                className="btn-outline-primary cursor-pointer block text-center font-bold h-12"
                block
              >
                {router.query.vehicleId ? 'Update Vehicle' : 'Create Vehicle'}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateVehicle;
