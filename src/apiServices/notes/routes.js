const router = require('express').Router();
const notesController = require('./controller');

/**
  @swagger
  {
    "tags": {
      "name": "Notes",
      "description": "API endpoints to manage Notes"
    }
  }
 */


router.post('/', notesController.create);

/**
  @swagger
  {
    "/notes": {
      "get": {
        "summary": "Returns all notes",
        "tags": ["Notes"],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "Number of notes to return",
            "required": false,
            "default": 10,
            "schema": {
              "type": "integer"
            },
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "ID of the note",
                        "example": "6401cabe528cbbb93899e71c"
                      },
                      "content": {
                        "type": "string",
                        "description": "Content of the note",
                        "example": "Learn Swagger Documentation"
                      },
                      "isDone": {
                        "type": "boolean",
                        "description": "Status of the note",
                        "example": true
                      },
                      "createdAt": {
                        "type": "string",
                        "format": "date-time",
                        "description": "Creation date of the note",
                        "example": "2023-03-12T22:20:24.520Z"
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Not valid request",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Not valid value for parameter 'limit'. Please provide an Integer number value"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
 */
router.get('/', notesController.readAll);


router.get('/:noteId', notesController.readById);
router.patch('/:noteId', notesController.updateById);
router.delete('/:noteId', notesController.deleteById);

module.exports = router;