const express = require("express");
const Joi = require("joi");
const Issue = require("../models/Issue");
const router = express.Router();

// create an issue
router.post("/", async (req, res, next) => {
	try {
		const { name, description, priority } = req.body;

		const schema = Joi.object({
			name: Joi.string().required(),
			description: Joi.string().min(3).required(),
			priority: Joi.string().valid("high", "low", "medium").required(),
		});

		const validationError = schema.validate({ name, description, priority })
			.error;
		if (validationError) {
			return res.status(422).json({
				status: 422,
				data: {
					errors: validationError.details.map((e) => ({
						message: e.message,
						field: e.path[0],
					})),
				},
				message: "All fields are required",
			});
		}

		const newIssue = new Issue({
			name,
			description,
			priority,
		});
		await newIssue.save();
		return res.status(201).json({
			status: 201,
			message: "Issue created successfully",
			data: {
				...newIssue,
			},
		});
	} catch (error) {
		next(error);
	}
});

// get an issue
router.get("/:issueId", async (req, res, next) => {
	try {
		const { issueId } = req.params;
		const issueToFind = await Issue.findOne({ id: issueId });

		if (issueToFind == null) {
			return res.status(404).json({
				status: 404,
				message: "Issue not found",
			});
		}
		return res.json({
			status: 200,
			message: "Issue fetched successfully",
			data: issueToFind,
		});
	} catch (error) {
		next(error);
	}
});

// update an issue
router.patch("/:issueId", async (req, res, next) => {
	try {
		const { issueId } = req.params;
		const { name, description, priority } = req.body;
		const fieldsToUpdate = { name, description, priority };
		const issueToUpdate = await Issue.findOne({ id: issueId });

		if (issueToUpdate == null) {
			return res.status(404).json({
				status: 404,
				message: "Issue not found",
			});
		}

		const schema = Joi.object({
			name: Joi.string(),
			description: Joi.string().min(3),
			priority: Joi.string().valid("high", "low", "medium"),
		});

		const validationError = schema.validate(fieldsToUpdate).error;
		if (validationError) {
			return res.status(422).json({
				status: 422,
				data: {
					errors: validationError.details.map((e) => ({
						message: e.message,
						field: e.path[0],
					})),
				},
				message: "Some fields are not validated",
			});
		}

		Object.entries(fieldsToUpdate).forEach(([key, value]) => {
			if (value) issueToUpdate[key] = value;
		});

		await issueToUpdate.save();

		return res.json({
			status: 200,
			message: "Issue updated successfully",
			data: issueToUpdate,
		});
	} catch (error) {
		next(error);
	}
});

// delete an issue
router.delete("/:issueId", async (req, res, next) => {
	try {
		const { issueId } = req.params;
		const issueToDelete = await Issue.findOne({ id: issueId });

		if (issueToDelete == null) {
			return res.status(404).json({
				status: 404,
				message: "Issue not found",
			});
		}

		await issueToDelete.remove();

		return res.json({
			status: 200,
			message: "Issue deleted successfully",
			data: issueToDelete,
		});
	} catch (error) {
		next(error);
	}
});

// get all issues and filter using valid queries
router.get("/", async (req, res, next) => {
	try {
		const validQueries = ["priority", "name", "description"];
		const queryObject = Object.entries(req.query).reduce(
			(acc, [key, value]) =>
				validQueries.includes(key)
					? {
							...acc,
							[key]: value,
					  }
					: acc,
			{}
		);

		console.log(req.query);
		const allIssues = await Issue.find(queryObject, { sort: { date: "DESC" } });
		return res.json({
			status: 200,
			message: "Issues fetched successfully",
			data: allIssues.rows,
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
