const { model } = require("ottoman");

const IssueModel = model("Issue", {
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	priority: {
		type: String,
		required: true,
		enum: ["high", "medium", "low"],
	},
	date: {
		type: Date,
		default: new Date(),
	},
});

module.exports = IssueModel;
