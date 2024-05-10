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
import { getVehicleByRDWLicencePlate } from '@/api/vehicles/vehicles';
import { ColumnsType } from 'antd/es/table';

const timeframesTitles = [
  '06:00 t/m 12:00',
  '12:00 t/m 18:00',
  '18:00 t/m 00:00',
  '00:00 T/M 6:00',
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
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
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
  availability: 'available',
  currency: 'EUR',
  pricePerDay: 0.0,
  status: VehicleStatus.PENDING,
  vin: '',
  timeframes: defaultTimeframes,
};

const CreateVehicle: React.FC = () => {
  const [searchPlate, setSearchPlate] = useState<string>('');
  const [vehicleData, setVehicleData] = useState(initialVehicleData);
  const { mutate: create, isPending: isCreating } = useCreateVehicle();
  const { update } = useUpdateVehicle();
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

  const handleCreateVehicle = async () => {
    if (router.query.vehicleId) {
      // update
      vehicleData.pricePerDay = Number(vehicleData.pricePerDay);
      vehicleData.status = VehicleStatus.PENDING;
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

  const onSetImageUrl = (url: string) => {
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
      <Form form={form} layout={'vertical'} initialValues={vehicleData}>
        <div className="vehicle-form bg-white border border-gray-300 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Item<any> label="Plate Number" name="licensePlate">
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
            <Form.Item<any> label="Model Name" name="model">
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
            <Form.Item<any> label="Year" name="manufactureYear">
              <Input
                name="manufactureYear"
                value={vehicleData?.manufactureYear}
                onChange={handleInputChange}
                placeholder="e.g., 2022"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Engine" name="engineType">
              <Input
                name="engineType"
                value={vehicleData?.engineType}
                onChange={handleInputChange}
                placeholder="e.g., V8"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Total Seats/Doors" name="seatingCapacity">
              <Input
                name="seatingCapacity"
                value={vehicleData?.seatingCapacity}
                onChange={handleInputChange}
                placeholder="e.g., 5"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Battery Capacity" name="batteryCapacity">
              <Input
                name="batteryCapacity"
                value={vehicleData?.batteryCapacity}
                onChange={handleInputChange}
                placeholder="e.g., 4000mAh"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Rental Period" name="rentalDuration">
              <Input
                name="rentalDuration"
                value={vehicleData?.rentalDuration}
                onChange={handleInputChange}
                placeholder="e.g., 7 days"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Price From" name="pricePerDay">
              <Input
                type="number"
                name="pricePerDay"
                value={vehicleData?.pricePerDay}
                onChange={handleInputChange}
                placeholder="e.g., 100"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Currency" name="currency">
              <Input
                name="currency"
                value={vehicleData?.currency}
                onChange={handleInputChange}
                placeholder="e.g., EUR"
              />
            </Form.Item>
            <Form.Item<any> label="Unique Feature" name="uniqueFeature">
              <Input
                name="uniqueFeature"
                value={vehicleData?.uniqueFeature}
                onChange={handleInputChange}
                placeholder="e.g., Self-parking feature"
              />
            </Form.Item>
            <Form.Item<any> label="VIN number" name="vin">
              <Input
                name="vin"
                value={vehicleData?.vin}
                onChange={handleInputChange}
                placeholder="e.g., VIN number of the tesla"
              />
            </Form.Item>
          </div>
          <Table
            rowClassName="bg-primary-light-2"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
          <div className={styles.columns}>
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
              <UploadImage setImageUrl={onSetImageUrl} />
            </div>
            <div>
              <Button
                onClick={handleCreateVehicle}
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
