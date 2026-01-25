import { faker } from '@faker-js/faker';
import crypto from 'crypto'; // Native Node.js module

// Defined the shape of the user object for Type Safety across the framework
export interface UserData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

/*
  Generates a random user with unique credentials leveraging faker
    Strategies used - 
      1. Random PII (Names, Address) via Faker.
      2. Unique Username via unique suffix (using random UUID fragment and date) to prevent test collisions in parallel execution.
 */
export const generateUser = (): UserData => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  //Using a UUID fragment and date for absolute uniqueness
  const uniqueSuffix = crypto.randomBytes(3).toString('hex'); // e.g., 'a1b2c3'
  //const today = new Date().toISOString().split('T')[0];    /*Can use as per need for getting unique usernames*/

  return {
    firstName,
    lastName,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode('#####'),
    phoneNumber: faker.phone.number(),
    ssn: faker.string.numeric(9),
    // Result: shivam.priya.a1b2c3.2026-01-24
    username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uniqueSuffix}`,
    password: 'Password123!'
  };
};