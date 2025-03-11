# API DOCS

## ("/files"):

Get all the files stored in db.

- ### Method: GET.

```json
  {
    id: number,
    fileName: string,
    filePath: string
  }
```

## ("/send-command"):

Sends a string command to the TCP server:

- ### Method: POST.

```json
  { command: string }
```
