import Joi from "@hapi/joi";
import { Context, Octokit } from "probot";
// @ts-ignore
import probotConfig from "probot-config";

export const getConfig = async <T = Record<string, any>>(
	context: Context,
	schema: object,
	file: string = "config.yml",
): Promise<T | undefined> => {
	const { error, value } = Joi.validate(await probotConfig(context, file), schema);

	if (error) {
		context.log.error(error.message);
		return undefined;
	}

	return value[Object.keys(schema)[0]];
};

export const getBotComment = async (
	context: Context,
	id: number,
): Promise<Octokit.IssuesListCommentsResponseItem | undefined> => {
	try {
		const comments: Octokit.Response<Octokit.IssuesListCommentsResponse> = await context.github.issues.listComments(
			context.repo({ issue_number: id }),
		);

		return comments.data.find(
			(comment: Octokit.IssuesListCommentsResponseItem) => comment.user.login === `${process.env.APP_NAME}[bot]`,
		);
	} catch (error) {
		context.log.error(error.message);
		return undefined;
	}
};
