import { relations } from "drizzle-orm/relations";
import { activities, activityRegistrations } from "./schema";

export const activityRegistrationsRelations = relations(activityRegistrations, ({one}) => ({
	activity: one(activities, {
		fields: [activityRegistrations.activityId],
		references: [activities.id]
	}),
}));

export const activitiesRelations = relations(activities, ({many}) => ({
	activityRegistrations: many(activityRegistrations),
}));