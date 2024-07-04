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
  engineType: '',
  seatingCapacity: '',
  batteryCapacity: '',
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
  zipcodeNumber: '',
  zipcodeCharacter: '',
  state: '',
};

const CreateVehicle: React.FC = () => {
  const router = useRouter();
  const isCreate = !router.query.vehicleId;
  const [searchPlate, setSearchPlate] = useState<string>('');
  const [vehicleData, setVehicleData] = useState(initialVehicleData);
  const { mutate: create, isPending: isCreating } = useCreateVehicle();
  const { update } = useUpdateVehicle();

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
              addonAfter="€"
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
    console.log(event);
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
    const validate = validateForm(vehicleData);
    if (!!validate) return;
    if (router.query.vehicleId) {
      // update
      vehicleData.pricePerDay = Number(vehicleData.pricePerDay);
      // vehicleData.status = VehicleStatus.PENDING;
      await update(router.query.vehicleId as string, vehicleData);
      message.success('Vehicle updated successfully');
      router.push('/dashboard/vehicles');
    } else {
      const data = await create(vehicleData);
      // if (data) {
      message.success('Vehicle added successfully');
      router.push('/dashboard/vehicles');
      // }
    }
  };

  const onSetPaperImageUrl = (url: string) => {
    setVehicleData((prevData) => ({
      ...prevData,
      papers: [...prevData.papers, url],
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

  console.log(vehicleData);

  return (
    <div className="p-8">
      <div className="flex mb-4">
        <Input
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
        </button>
      </div>
      <Form
        onFinish={handleCreateVehicle}
        form={form}
        layout={'vertical'}
        initialValues={vehicleData}
      >
        <div className="vehicle-form bg-white border border-gray-300 rounded-xl p-6">
          <h1 className="text-xl mb-6">Autodetails</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Item<any>
              label="Nummerplaat"
              name="licensePlate"
              // rules={[
              //   { required: true, message: 'Please input your username!' },
              // ]}
            >
              <Input
                name="licensePlate"
                value={vehicleData?.licensePlate}
                onChange={handleInputChange}
                placeholder="e.g., ABC 1234"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Company" name="companyName">
              <Input
                name="companyName"
                value={vehicleData?.companyName}
                onChange={handleInputChange}
                placeholder="e.g., Toyota"
              />
            </Form.Item>
            <Form.Item<any> label="Modelnaam" name="model">
              <Input
                name="model"
                value={vehicleData?.model}
                onChange={handleInputChange}
                placeholder="e.g., Camry"
              />
            </Form.Item>
            <Form.Item<any> label="Type" name="availability">
              <Input
                name="availability"
                value={vehicleData?.availability}
                onChange={handleInputChange}
                placeholder="e.g., Available"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Jaar" name="manufactureYear">
              <Input
                name="manufactureYear"
                value={vehicleData?.manufactureYear}
                onChange={handleInputChange}
                placeholder="e.g., 2022"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Motor" name="engineType">
              <Select
                size="large"
                options={engineTypeOptions}
                name="engineType"
                value={vehicleData?.engineType}
                onChange={onSelectChange('engineType')}
                placeholder="e.g., V8"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Zitplaatsen" name="seatingCapacity">
              <Input
                name="seatingCapacity"
                value={vehicleData?.seatingCapacity}
                onChange={handleInputChange}
                placeholder="e.g., 5"
              />
            </Form.Item>{' '}
            <Form.Item<any>
              label="Actieradius"
              name="batteryCapacity"
              // rules={[{ required: true, message: '' }]}
            >
              <InputNumber
                className="w-full"
                addonAfter="KM"
                name="batteryCapacity"
                value={vehicleData?.batteryCapacity}
                onChange={onSelectChange('batteryCapacity')}
                placeholder="e.g., 4000mAh"
              />
            </Form.Item>{' '}
            {/* <Form.Item<any> label="Price From" name="pricePerDay">
              <Input
                type="number"
                name="pricePerDay"
                value={vehicleData?.pricePerDay}
                onChange={handleInputChange}
                placeholder="e.g., 100"
              />
            </Form.Item>{' '} */}
            <Form.Item<any> label="Unique Feature" name="uniqueFeature">
              <Input
                name="uniqueFeature"
                value={vehicleData?.uniqueFeature}
                onChange={handleInputChange}
                placeholder="e.g., Self-parking feature"
              />
            </Form.Item>
            <Form.Item<any> label="VIN nummer" name="vin">
              <Input
                name="vin"
                value={vehicleData?.vin}
                onChange={handleInputChange}
                placeholder="e.g., VIN number of the tesla"
              />
            </Form.Item>
            <h1 className="col-span-full text-xl">Huurdetails</h1>
            <Form.Item<any> label="Min. huurperiode" name="rentalDuration">
              <Input
                name="rentalDuration"
                value={vehicleData?.rentalDuration}
                onChange={handleInputChange}
                placeholder="e.g., 7 days"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Munteenheid" name="currency">
              <Input
                name="currency"
                value={vehicleData?.currency}
                onChange={handleInputChange}
                placeholder="e.g., EUR"
              />
            </Form.Item>
            <h1 className="col-span-full text-xl">Ophaallocatie</h1>
            <div className="col-span-1 flex w-full gap-2">
              <Form.Item<any>
                label="Straatnaam"
                name="streetName"
                className="w-full"
              >
                <Input
                  name="streetName"
                  value={vehicleData?.streetName}
                  onChange={handleInputChange}
                  placeholder="Damstraat"
                />
              </Form.Item>
              <Form.Item<any>
                label="Huisnummer"
                name="streetNumber"
                className="flex flex-col justify-end"
              >
                <Input
                  name="streetNumber"
                  value={vehicleData?.streetNumber}
                  onChange={handleInputChange}
                  placeholder="34"
                />
              </Form.Item>
            </div>
            <div className="col-span-1 flex w-full gap-2">
              <Form.Item<any>
                label="Postcode"
                name="zipcodeNumber"
                className="w-full"
              >
                <Input
                  name="zipcodeNumber"
                  value={vehicleData?.zipcodeNumber}
                  onChange={handleInputChange}
                  placeholder="1234"
                />
              </Form.Item>
              <Form.Item<any>
                label=""
                name="zipcodeCharacter"
                className="flex flex-col justify-end"
              >
                <Input
                  name="zipcodeCharacter"
                  value={vehicleData?.zipcodeCharacter}
                  onChange={handleInputChange}
                  placeholder="AB"
                />
              </Form.Item>
              <Form.Item<any> label="Plaats" name="state" className="w-full">
                <Input
                  name="state"
                  value={vehicleData?.state}
                  onChange={handleInputChange}
                  placeholder="Amsterdam"
                />
              </Form.Item>
            </div>
          </div>
          <Table
            rowClassName="bg-primary-light-2"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
          <div className={styles.columns}>
            <h3 className="text-lg">Car images</h3>
            <div>
              <Row gutter={16}>
                {vehicleData.images.map((image) => (
                  <Col span={6} key={image}>
                    <DisplayImage imageUrl={image} onImageDelete={() => null} />
                  </Col>
                ))}
              </Row>
            </div>
            <div>
              <UploadImage
                placeholder="Upload car images"
                setImageUrl={onSetCarImageUrl}
              />
            </div>
            <h3 className="text-lg">Paper images</h3>
            <div>
              <Row gutter={16}>
                {vehicleData.papers.map((image) => (
                  <Col span={6} key={image}>
                    <DisplayImage imageUrl={image} onImageDelete={() => null} />
                  </Col>
                ))}
              </Row>
            </div>
            <div>
              <UploadImage
                placeholder="Upload paper images"
                setImageUrl={onSetPaperImageUrl}
              />
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
