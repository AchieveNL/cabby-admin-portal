// vehicles/hooks.ts (Continuation)

import axios from 'axios';

const RDW_API_URL = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=';

export const getVehicleByRDWLicencePlate = async (licencePlate: string) => {
  const response = await axios.get(`${RDW_API_URL}${licencePlate}`);
  return response.data[0];
};
