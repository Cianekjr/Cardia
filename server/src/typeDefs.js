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
  
  type Model {
    id: Int!
    bodyType: String!
    make: String!
    model: String!
    generation: String
    engineCapacity: Float!
    enginePower: Int!
    engineType: EngineType!
    inspections: [Inspection!]
  }
  
	type Inspection {
		id: Int!
		createdAt: DateTime!
		updatedAt: DateTime!
		station: Station!
		stationId: Int!

		model: Model!
		modelId: Int!
		mileage: Int!
		firstRegistrationDate: DateTime!
		age: Int
    
    result: Result!
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

	type Query {
		getCurrentStation: Station
  }

	type Mutation {
		signUp(input: SignUpInput!): Station!
		signIn(input: SignInInput!): Station!
	}

	enum EngineType {
		DIESEL
		PETROL
		ELECTRIC
		HYBRID
	}

	enum Result {
		POSITIVE
		NEGATIVE
	}
`

export default typeDefs
