import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, message } from 'antd';
import UploadImage from '@/components/inputs/UploadImage';
import { useRouter } from 'next/router'; // Fixed 'next/navigation' to 'next/router'
import { VehicleInput, VehicleStatus } from '@/api/vehicles/types';
import { useCreateVehicle } from '@/api/vehicles/hooks';
import { getVehicleByRDWLicencePlate } from '@/api/openData/openApi';
import DisplayImage from '@/components/image/DisplayImage';
import styles from './CreateVehicle.module.scss';

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
  pricePerDay: 60.0,
  status: VehicleStatus.PENDING,
};

const CreateVehicle: React.FC = () => {
  const [searchPlate, setSearchPlate] = useState<string>('');
  const [vehicleData, setVehicleData] = useState(initialVehicleData);
  const { create, loading: isCreating } = useCreateVehicle();
  const router = useRouter();

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

        // Mapping the data from the RDW API to your vehicleData state.
        setVehicleData((prevData) => ({
          ...prevData,
          licensePlate: vehicleInfo.kenteken || '',
          companyName: vehicleInfo.merk || '',
          model: vehicleInfo.handelsbenaming || '',
          manufactureYear:
            new Date(vehicleInfo.datum_eerste_toelating_dt)
              .getFullYear()
              .toString() || '',
          // Add more mappings as necessary. If some data isn't available in the API response, it will remain an empty string or its initial value.
        }));
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
    const data = await create(vehicleData);
    if (data) {
      message.success('Vehicle added successfully');
      router.push('/dashboard/vehicles');
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
      <Form layout={'vertical'} initialValues={vehicleData}>
        <div className="vehicle-form bg-white border border-gray-300 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Item<any> label="Plate Number" name="plateNumber">
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
            <Form.Item<any> label="Model Name" name="modelName">
              <Input
                name="model"
                value={vehicleData?.model}
                onChange={handleInputChange}
                placeholder="e.g., Camry"
              />
            </Form.Item>
            <Form.Item<any> label="Type" name="type">
              <Input
                name="availability"
                value={vehicleData?.availability}
                onChange={handleInputChange}
                placeholder="e.g., Available"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Year" name="year">
              <Input
                name="manufactureYear"
                value={vehicleData?.manufactureYear}
                onChange={handleInputChange}
                placeholder="e.g., 2022"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Engine" name="engine">
              <Input
                name="engineType"
                value={vehicleData?.engineType}
                onChange={handleInputChange}
                placeholder="e.g., V8"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Total Seats/Doors" name="totalSeats">
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
            <Form.Item<any> label="Rental Period" name="rentalPeriod">
              <Input
                name="rentalDuration"
                value={vehicleData?.rentalDuration}
                onChange={handleInputChange}
                placeholder="e.g., 7 days"
              />
            </Form.Item>{' '}
            <Form.Item<any> label="Price From" name="priceRangeFrom">
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
          </div>

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
                Create Vehicle
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateVehicle;
