# Example Usage

## `manual.yml`

This is an example workflow where the code upload is manually triggered via the Actions tab in the repository.

## `on-issue-comment.yml`

This is an example workflow that is triggered whenever a comment is made within the repository
(e.g. a comment on a pull request) that contains the keywords "@Upload to Optimizely". When
triggered, an :eyes: reaction is added to the comment.

The results of the upload are appended to the comment noting whether or not the upload was successful.
In the case that an upload was not successful, the error reason is added as well.
* In addition, on successful uploads a :rocket: reaction is added to the comment, whereas in
unsuccessful uploads a :-1: reaction is added.

This particular workflow is highly customizable and in addition to this action uses the
[pull-request-comment-trigger](https://github.com/Khan/pull-request-comment-trigger) and
[create-or-update-comment](https://github.com/peter-evans/create-or-update-comment) actions
to handle the trigger and comment updates respectively.

One could imagine, for example, augmenting this workflow to use the `custom-comment` field to append a comment to
the custom code noting the time that the upload was performed.

Another example is adding an action that can minify JavaScript code to the workflow in order to
minify any code before uploading it to Optimizely.

This is just a couple examples of the near infinite workflows that one could build using this action.
