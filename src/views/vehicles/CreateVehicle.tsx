import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Table,
  message,
} from 'antd';
import UploadImage from '@/components/inputs/UploadImage';
import { useRouter } from 'next/router'; // Fixed 'next/navigation' to 'next/router'
import { VehicleInput, VehicleStatus } from '@/api/vehicles/types';
import {
  useCreateVehicle,
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
  const [searchPlate, setSearchPlate] = useState<string>('');
  const [vehicleData, setVehicleData] = useState(initialVehicleData);
  const { mutateAsync: create, isPending: isCreating } = useCreateVehicle();
  const { mutateAsync: update } = useUpdateVehicle();
  const router = useRouter();
  const [form] = Form.useForm();
  const { data: vehicle } = useVehicleById(router.query.vehicleId as string);

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
      await update({ id: router.query.vehicleId as string, data: vehicleData });
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
  const onRemoveCarImage = (url: string) => {
    setVehicleData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((el) => el !== url),
    }));
  };
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
          <h1 className="text-xl mb-6 font-medium">Autodetails</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Item<any>
              rules={[{ required: true, message: 'Automerk is required!' }]}
              label="Automerk"
              name="companyName"
            >
              <Input
                name="companyName"
                value={vehicleData?.companyName}
                onChange={handleInputChange}
                placeholder="e.g., Toyota"
              />
            </Form.Item>
            <Form.Item<any>
              rules={[{ required: true, message: 'Model is required!' }]}
              label="Model"
              name="model"
            >
              <Input
                name="model"
                value={vehicleData?.model}
                onChange={handleInputChange}
                placeholder="e.g., Camry"
              />
            </Form.Item>
            <Form.Item<any>
              label="Kenteken"
              name="licensePlate"
              rules={[{ required: true, message: 'Kenteken is required!' }]}
            >
              <Input
                name="licensePlate"
                value={vehicleData?.licensePlate}
                onChange={handleInputChange}
                placeholder="e.g., ABC 1234"
              />
            </Form.Item>{' '}
            <Form.Item<any>
              rules={[{ required: true, message: 'VIN nummer is required!' }]}
              label="VIN nummer"
              name="vin"
            >
              <Input
                name="vin"
                value={vehicleData?.vin}
                onChange={handleInputChange}
                placeholder="e.g., VIN number of the tesla"
              />
            </Form.Item>
            <Form.Item<any>
              rules={[{ required: true, message: 'Bouwjaar is required!' }]}
              label="Bouwjaar"
              name="manufactureYear"
            >
              <Input
                type="number"
                name="manufactureYear"
                value={vehicleData?.manufactureYear}
                onChange={handleInputChange}
                placeholder="e.g., 2022"
              />
            </Form.Item>
            <Form.Item<any>
              rules={[{ required: true, message: 'Actieradius is required!' }]}
              label="Actieradius"
              name="batteryCapacity"
            >
              <Input
                type="number"
                name="batteryCapacity"
                value={vehicleData?.batteryCapacity}
                onChange={handleInputChange}
                placeholder="100 Km "
              />
            </Form.Item>
            <Form.Item<any>
              rules={[{ required: true, message: 'Zitplaatsen is required!' }]}
              label="Zitplaatsen"
              name="seatingCapacity"
            >
              <Input
                type="number"
                name="seatingCapacity"
                value={vehicleData?.seatingCapacity}
                onChange={handleInputChange}
                placeholder="e.g., 5"
              />
            </Form.Item>
            <h1 className="col-span-full text-xl font-medium">Ophaallocatie</h1>
            <div className="col-span-full flex w-full gap-2">
              <Form.Item<any>
                rules={[{ required: true, message: 'Straatnaam is required!' }]}
                label="Straatnaam"
                name="streetName"
                className="flex-1"
              >
                <Input
                  name="streetName"
                  value={vehicleData?.streetName}
                  onChange={handleInputChange}
                  placeholder="Damstraat"
                />
              </Form.Item>
              <Form.Item<any>
                rules={[{ required: true, message: 'Huisnummer is required!' }]}
                label="Huisnummer"
                name="streetNumber"
                className="flex-1"
              >
                <Input
                  name="streetNumber"
                  value={vehicleData?.streetNumber}
                  onChange={handleInputChange}
                  placeholder="34"
                />
              </Form.Item>
            </div>
            <div className="col-span-full flex w-full gap-2">
              <div className="flex-1 flex gap-2">
                <Form.Item<any>
                  rules={[{ required: true, message: 'Postcode is required!' }]}
                  label="Postcode"
                  name="zipcodeNumber"
                  className="flex-[2]"
                >
                  <Input
                    name="zipcodeNumber"
                    value={vehicleData?.zipcodeNumber}
                    onChange={handleInputChange}
                    placeholder="1234"
                  />
                </Form.Item>
                <Form.Item<any>
                  rules={[{ required: true, message: 'Is required!' }]}
                  label=""
                  name="zipcodeCharacter"
                  className="flex flex-col justify-end flex-1"
                >
                  <Input
                    name="zipcodeCharacter"
                    value={vehicleData?.zipcodeCharacter}
                    onChange={handleInputChange}
                    placeholder="AB"
                  />
                </Form.Item>
              </div>
              <Form.Item<any>
                rules={[{ required: true, message: 'Plaats is required!' }]}
                label="Plaats"
                name="state"
                className="flex-1"
              >
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
                placeholder="Upload car images"
                setImageUrl={onSetCarImageUrl}
              />
            </div>
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
