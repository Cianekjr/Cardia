import { gql } from "apollo-server-express";

const typeDefs = gql`
	scalar DateTime

	type Station {
		id: Int!
		createdAt: DateTime!
		email: String!
		name: String!
		password: String!
		inspections: [Inspection!]
	}

	type Car {
    id: Int!
    bodyType: BodyType!
    bodyTypeId: Int!
    model: Model!
    modelId: Int!
    engineCapacity: Int!
    enginePower: Int!
    engineType: EngineType!
    engineTypeId: Int!
    inspections: [Inspection!]!
	}

	type BodyType {
    id: Int!
    name: String!
    Car: [Car!]!
	}

	type EngineType {
    id: Int!
    name: String!
    Car: [Car!]!
	}

	type Make {
    id: Int!
    name: String!
    Model: [Model!]!
	}

	type Model {
    id: Int!
    make: Make!
    makeId: Int!
    name: String!
  
    Car: [Car!]!
	}

	type Inspection {
		id: Int!
		createdAt: DateTime!
		updatedAt: DateTime!
		station: Station!
		stationId: Int!

		car: Car!
		carId: Int!
		mileage: Int!
		age: Int!

		inspectionQualitativeFaults: [InspectionQualitativeFault!]!
		inspectionQuantitativeFaults: [InspectionQuantitativeFault!]!

		result: Result!
	}

	type InspectionQualitativeFault {
		inspection: Inspection!
		inspectionId: Int!
		qualitativeFault: QualitativeFault!
		qualitativeFaultId: Int!
		dangerLevel: DangerLevel!
	}

	type QualitativeFault {
		id: ID!
		component: String!
		part: String
		description: String!
		dangerLevels: [DangerLevel!]!
		InspectionQualitativeFault: [InspectionQualitativeFault!]!
	}
  
  type InspectionQuantitativeFault {
    inspection: Inspection!
    inspectionId: Int!
		quantitativeFault: QuantitativeFault!
		quantitativeFaultId: Int!
		value: Float!
  }
  
  type QuantitativeFault {
		id: Int!
		component: String!
		part: String
		description: String!
		minValue: Float
		maxValue: Float
		unit: String!

		InspectionQuantitativeFault: [InspectionQuantitativeFault!]!
  }

	input SignUpInput {
		email: String!
		password: String!
    name: String!
	}

	input SignInInput {
		email: String!
		password: String!
	}
  
  input InspectionQualitativeFaultInput {
		qualitativeFaultId: Int!
		dangerLevel: DangerLevel!
  }

	input InspectionQuantitativeFaultInput {
		quantitativeFaultId: Int!
		value: Float!
	}
  
  input CreateInspectionInput {
		carId: Int!
		mileage: Int!
		age: Int!

		inspectionQualitativeFaults: [InspectionQualitativeFaultInput!]!
		inspectionQuantitativeFaults: [InspectionQuantitativeFaultInput!]!
  }

	type Query {
		getCurrentStation: Station
  }

	type Mutation {
		signUp(input: SignUpInput!): Station!
		signIn(input: SignInInput!): Station!
    logout: Boolean
    createInspection(input: CreateInspectionInput!): Inspection!
	}

	enum Result {
		POSITIVE
		NEGATIVE
	}

	enum DangerLevel {
		MINOR
		SIGNIFICANT
		MAJOR
	}
`

export default typeDefs
