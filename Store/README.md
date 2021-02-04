# Store Application

## Running Instructions

_Prerequisites_
* .NET SDK - https://dotnet.microsoft.com/download
* Node.js

_Instructions_
1. Open terminal/command prompt and navigate to `Shop/Shop`
2. Run `dotnet run` command
3. Web application can be accessed at localhost:5001

_API Endpoints_

GET - localhost:5001/api/Package
POST - localhost:5001/api/Package
PUT - localhost:5001/api/Package/{id}
DELETE - localhost:5001/api/Package/{id}

Optional get param of currency=gbp for alternative currencies. Will default to USD.

_API Example POST/PUT payload_

```JSON
{
	"Name": "Package Name",
	"Description": "Description text here..",
	"Products": [
		"7Hv0hA2nmci7",
		"PKM5pGAh9yGm"
	]
}
```

_General Notes_

Built using .NET Core and React/Redux. An SQLite DB is included with a few rows in the Packages table.
