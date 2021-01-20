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
    model: Model!
    modelId: Int!
		engineType: EngineType!
		engineTypeId: Int!
    engineCapacity: Int!
    enginePower: Int!
    inspections: [Inspection!]!
	}

	type BodyType {
    id: Int!
    name: String!
    Car: [Car!]!
    Model: [Model!]!
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
		bodyType: BodyType!
		bodyTypeId: Int!
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
		id: Int!
		component: Component!
		componentId: Int!
		part: String!
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
		component: Component!
		componentId: Int!
		part: String!
		description: String!
		minValue: Float
		maxValue: Float
		unit: String!

		InspectionQuantitativeFault: [InspectionQuantitativeFault!]!
  }

	type Component {
    id: Int!
    name: String!
    QualitativeFault: [QualitativeFault!]!
    QuantitativeFault: [QuantitativeFault!]!
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
  
  type Faults {
		qualitativeFaults: [QualitativeFault!]!
		quantitativeFaults: [QuantitativeFault!]!
  }
  
  type AnalyticsFilter {
    bodyTypes: [BodyType!]!
    makes: [Make!]!
    models: [Model!]!
    engineTypes: [EngineType!]!
  }
  
  type ComponentsFaultsData {
    keys: [String!]!
    values: [Int!]!
  }

  type AnalyticsData {
    allInspectionsCount1: Int
    allInspectionsCount2: Int
		allStationsCount1: Int
		allStationsCount2: Int
		inspectionResultsData1: [Int!]
		inspectionResultsData2: [Int!]
		componentsFaultsData1: ComponentsFaultsData
		componentsFaultsData2: ComponentsFaultsData
		commonQualitativeFaults1: [QualitativeFault!]
		commonQuantitativeFaults1: [QuantitativeFault!]
		commonQualitativeFaults2: [QualitativeFault!]
		commonQuantitativeFaults2: [QuantitativeFault!]
		faultsDistributionLabels: [Float]
		faultsDistributionData1: [Float]
		faultsDistributionData2: [Float]
  }
  
  input AnalyticsDataInput {
		makeId1: Int
		bodyTypeId1: Int
		modelId1: Int
		engineTypeId1: Int

		makeId2: Int
		bodyTypeId2: Int
		modelId2: Int
		engineTypeId2: Int
    
		createdAtMin: DateTime
    createdAtMax: DateTime
  
    mileageMin: Int
    mileageMax: Int
    ageMin: Int
    ageMax: Int
    
    engineCapacityMin: Int
    engineCapacityMax: Int
    enginePowerMin: Int
    enginePowerMax: Int
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
    getAllCars: [Car!]!
    getAllFaults: Faults!
		getAllComponents: [Component!]!
    getAnalyticsData(input: AnalyticsDataInput): AnalyticsData!
		getAnalyticsFilters: AnalyticsFilter!
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
