import { gql } from "apollo-server-express";

const typeDefs = gql`
	scalar DateTime

	type Inspection {
		createdAt: DateTime!
		id: Int!
		station: Station!
		stationId: Int!
		updatedAt: DateTime!
	}

	type Station {
		id: Int!
		inspections: [Inspection!]!
		name: String!
		user: User!
		userId: Int!
	}

	type User {
		createdAt: DateTime!
		email: String!
		id: Int!
		password: String!
		role: Role!
		station: Station
	}

	input SignupUserInput {
		email: String!
		password: String!
		role: Role!
	}

	input LoginUserInput {
		email: String!
		password: String!
	}
  
  input CreateStationInput {
		name: String!
  }

	enum Role {
		ANALYST
		DIAGNOSTICIAN
	}

	type Query {
		user: User
  }

	type Mutation {
		signupUser(input: SignupUserInput!): User
		createStation(input: CreateStationInput!): Station
		loginUser(input: LoginUserInput!): User
	}
`

export default typeDefs
