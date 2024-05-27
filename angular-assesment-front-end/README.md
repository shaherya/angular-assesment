# Solvpath Assessment

This is the front-end angular assessment

[Installation](#installation)  
[Usage](#usage)  
[Assignment](#assignment)  


## Installation

Run NPM install (use node v14)

```
npm install
```

## Usage
set the API_URL environment variable

```
export API_URL=https://api.staging.solvpath.com
```

Or put it in a .env file and source it

```
cp .env.example .env
. ./.env
```

Build and run the angular project

```
npm start
```

Use your browser to navigate to the project url:

http://localhost:4200

login using the following credentials
<a name="credentials"></a>
```
username: test@solvpath.com
password: ivrpath123
```

## Assignment

Implement the autoresponder app, which should contain components to allow the user to create, view, edit, and delete autoresponders.

1. Implement a component that displays the list of autoresponders
    1. list should show each autoresponder's name, type, and links for edit and delete
       - clicking edit should navigate to page to edit that autoresponder
       - clicking delete should popup the confirmation message "Are you sure you want to delete this autoresponder?".  If user clicks OK, then delete, if they click CANCEL, then do nothing
    2. there should be a link to add a new autoresponder
       - clicking the link should navigate to page to add a new autoresponder
    3. Page should look and work the same as it does in this example:
       https://assessment.staging.solvpath.com/autoresponders  
       you can login using the above [credentials](#credentials)


2. Implement components for editing or adding a new autoresponder
    1. there should be a text field for setting the name
    2. type can only be enum value (1) for SMS, so this can be a hidden field
    3. there should be an array of forms for each response object
        1. Existing autoresponders will show a form for each of their responses
        2. New autoresponders will show an empty form for the 1st response by default
        3. There will be a link to add a new response - clicking the link will show a new empty response form
        4. Every response form, except for the 1st one, will have a delete button - clicking it will delete the response object and the corresponding form.
        5. Each response form will have the following fields:
           1. id: hidden field
           2. days: number (min 0)
           3. hours: number (0-23)
           4. minutes: select with options for 0, 15, 30, and 45 minutes
               - at least one of days, hours or minutes must be set to a value greater than 0
           5. message: textarea (required) - you can use our existing projectable-editor directive for our tinymce editor:
               ```
               <projectable-editor [id]="'message-' + index" formControlName="message"
               plugins="path-variables"
               toolbar="path-variables"
               [init]="{
               path_variables: smsPathVariables,
               forced_root_block: '',
               valid_elements: '',
               init_instance_callback: smsEditorInitCallback
               }"
               ></projectable-editor>
               ```
           6. checkbox for "Use different response for after hours?".
           7. after hours message: textarea
              - also uses projectable-editor
              - only show this field if the checkbox is checked, otherwise hide it

        6. On page init, for existing models, convert data from [model](#models) to form data to populate the form:
           - convert delay in minutes into separate days, hours and minutes
           - if message_after_hours is not empty, check the "Use different response for after hours?" checkbox
        7. clicking save should do the following:
           1. convert form data into [model](#models) used by the [api](#api)
              - convert days, hours and minutes into total delay in minutes
              - if "Use different response for after hours?" checkbox is unchecked, message_after_hours should be null
           2. call the approriate api to either create (if new) or update (if existing)
           3. refresh the data on screen
    4. Page should look and work the same as it does in this example:  
       https://assessment.staging.solvpath.com/autoresponder/new  
       you can login using the above [credentials](#credentials)

3. Add an AutoResponders link to autoresponders component in the sidebar
4. All autoresponder functionality should look and work the same as in the example:
   https://assessment.staging.solvpath.com/
    ```
    username: test@solvpath.com
    password: ivrpath123
    ```
5. The [models](#models) are shown below for your reference, but they are already defined for you in _models/autoresponder.ts and _models/pager.ts
6. The [api](#api) definition is shown below for your reference, however its recommended to use the helper classes:
   1. add an autoresponder service in _services derived from PaginationService.  It should just call the base constructor with "autoresponders".  
   See AddressService as an example.
   
   2. The autoresponder list component can derive from CrudPagedListComponent which will handle the api request and return an observable of your paginated results in this.data$.  
   See AddressComponent as an example.
   
   3. The autoresponder form component can derive from CrudSaveComponent which for existing objects (where id is set) will handle the api request and return an observable of the object in this.data$.  
   It will also handle calling the api for create or update upon form submit.  
   See AddressNewComponent and AddressEditComponent as an example.

### Models

#### Response
```
{
  id?: number - unique id, not used for new object
  delay: number (required) - represents a number in minutes
  message: string (required)
  message_after_hours?: string or null
}
```

#### AutoResponder
```
{
  id?: number - unique id, not used for new object
  name: string string (required)
  type: enum (required) - enum values: 1 = SMS (this is the only value)
  responses: array of Response objects (required, with at least 1 response required)
}
```

#### Pager
```
{
  page: number
  num_pages: number - number of pages
  count: number - number of results
  results: array of objects (i.e. AutoResponder objects)
}
```

### API

### List AutoResponders

GET /autoresponders/

#### Request

```
{
    page: number
    page_size: number
}
```

#### Response

HTTP 200 OK

[Pager](#pager) object

### Retrieve AutoResponder

GET /autoresponders/{id}/

#### Response

HTTP 200 OK

[AutoResponder](#autoresponder) object

### Create AutoResponder

POST /autoresponders/

#### Request

[AutoResponder](#autoresponder) object

#### Response

HTTP 201 Created

[AutoResponder](#autoresponder) object

### Update AutoResponder

PUT /autoresponders/{id}/

#### Request

[AutoResponder](#autoresponder) object

#### Response

HTTP 200 OK

[AutoResponder](#autoresponder) object

### Delete AutoResponder

DELETE /autoresponders/{id}/

#### Response

HTTP 204 No Content
