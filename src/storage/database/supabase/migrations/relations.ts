import { relations } from "drizzle-orm/relations";
import { users, activities, visits, registrations, activityRegistrations } from "./schema";

export const activitiesRelations = relations(activities, ({one, many}) => ({
	user: one(users, {
		fields: [activities.createdBy],
		references: [users.id]
	}),
	registrations: many(registrations),
	activityRegistrations: many(activityRegistrations),
}));

export const usersRelations = relations(users, ({many}) => ({
	activities: many(activities),
	visits: many(visits),
	registrations: many(registrations),
	activityRegistrations: many(activityRegistrations),
}));

export const visitsRelations = relations(visits, ({one, many}) => ({
	user: one(users, {
		fields: [visits.createdBy],
		references: [users.id]
	}),
	registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({one}) => ({
	activity: one(activities, {
		fields: [registrations.activityId],
		references: [activities.id]
	}),
	user: one(users, {
		fields: [registrations.userId],
		references: [users.id]
	}),
	visit: one(visits, {
		fields: [registrations.visitId],
		references: [visits.id]
	}),
}));

export const activityRegistrationsRelations = relations(activityRegistrations, ({one}) => ({
	activity: one(activities, {
		fields: [activityRegistrations.activityId],
		references: [activities.id]
	}),
	user: one(users, {
		fields: [activityRegistrations.userId],
		references: [users.id]
	}),
}));