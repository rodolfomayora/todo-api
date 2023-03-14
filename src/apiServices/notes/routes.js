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

/** GET /notes/:noteId
  @swagger
  {
    "/notes/{noteId}": {
      "get": {
        "summary": "Find a note by ID",
        "tags": ["Notes"],
        "parameters": [
          {
            "name": "noteId",
            "in": "path",
            "description": "ID of the required note",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
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
                  "message": "Not valid note ID"
                }
              }
            }
          },
          "404": {
            "description": "Not found resource",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                 "example": {
                  "message": "Not Found, note ID not match"
                }
              }
            }
          }
        }
      }
    }
  }
 */
router.get('/:noteId', notesController.readById);

/** PATCH /notes/:noteid
  @swagger
  {
    "/notes/{noteId}": {
      "patch": {
        "summary": "Update an existing note by ID",
        "tags": ["Notes"],
        "parameters": [
          {
            "name": "noteId",
            "in": "path",
            "description": "ID of the required note",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Note to update on the system",
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
                    "example": "New content infor"
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
                  "message": "Not valid note ID"
                }
              }
            }
          },
          "404": {
            "description": "Note not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                 "example": {
                  "message": "Not Found, note ID not match"
                }
              }
            }
          }
        }
      }
    }
  }
 */
router.patch('/:noteId', notesController.updateById);

/** DELETE /notes/:noteId
  @swagger
  {
    "/notes/{noteId}": {
      "delete": {
        "summary": "Deletes a note by ID",
        "tags": ["Notes"],
        "parameters": [
          {
            "name": "noteId",
            "in": "path",
            "description": "ID of the required note",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Resource deleted successfully"
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
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "example": {
                  "message": "Not valid note ID"
                }
              }
            }
          },
          "404": {
            "description": "Note not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "example": {
                  "message": "Not Found, note ID not match"
                }
              }
            }
          }
        }
      }
    }
  }
 */
router.delete('/:noteId', notesController.deleteById);

module.exports = router;