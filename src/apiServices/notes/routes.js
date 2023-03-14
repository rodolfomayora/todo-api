const router = require('express').Router();
const notesController = require('./controller');

/** COMPONENTS
  @swagger
  {
    "components": {
      "schemas": {
        "Note": {
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
        },
        "ErrorResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
            }
          }
        }
      }
    }
  }
 */

/** TAGS
  @swagger
  {
    "tags": {
      "name": "Notes",
      "description": "API endpoints to manage Notes"
    }
  }
 */

/** POST /notes
  @swagger
  {
    "/notes": {
      "post": {
        "summary": "Create note",
        "tags": ["Notes"],
        "requestBody": {
          "description": "Note to add to the system",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "content": {
                    "type": "string",
                    "required": true,
                    "maxLength": 100,
                    "description": "Text content of the note",
                    "example": "Learn Open API Specification"
                  },
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Note"
                }
              }
            }
          },
          "400": {
            "description": "Not valid request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "example": {
                  "message": "Required key(s): 'content'"
                }
              }
            }
          }
        }
      }
    }
  }
 */
router.post('/', notesController.create);

/** GET /notes
  @swagger
  {
    "/notes": {
      "get": {
        "summary": "Return all notes",
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
                    "$ref": "#/components/schemas/Note"
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
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "example": {
                  "message": "Unexpected value(s): 'limit' should be an integer number"
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