# Yet Another Google Spreadsheet API (yagsa)

## Does

- Return a published Google Sheet as JSON given a sheet ID.
- Convert numbers and booleans to their appropriate types.
- Treat the first row of the spreadsheet as column headers.
- Briefly cache.

## Does not

- Allow spreadsheet modification.
- Do anything related to authentication.
- Return data from multiple sheets in one call.
- Return a list of sheets.

## Why this as opposed to alternatives for quick data management with an API

**[Tabletop.js](https://github.com/jsoma/tabletop)** relies on ["older" (i.e. not current) APIs](https://developers.google.com/gdata/samples/spreadsheet_sample), and we all know how [fickle Google can be about keeping around "older" products/services, much less current ones](https://en.wikipedia.org/wiki/Category:Discontinued_Google_services).

**[Sheetsu](https://sheetsu.com)** is [expensive](https://sheetsu.com/pricing).

**[Airtable](https://airtable.com)** requires authentication and has a 5 request/second rate limit which may be too low depending on your application.

**[Fieldbook](https://fieldbook.com)** is [also kind of expensive](http://docs.fieldbook.com/docs/plans-and-pricing).

And of course as is always the case with external services (especially the more startup ones), who knows if they'll be around in a few years and you'll need to migrate everything.

## How it works

This is a roll-your-own-server solution running Node and Express. It parses Google's "Publish to the web" CSV file with a Node implementation of the excellent [Papa Parse](http://papaparse.com) library. The whole business logic is about 10 lines of code in `routes.js`; the rest is just config.

## How to use

1. Deploy application on a server somewhere. ([DigitalOcean](https://www.digitalocean.com) with [Dokku](http://dokku.viewdocs.io/dokku/) is great.)
2. Create a Google Spreadsheet where columns are fields, rows are records, and the first row is a header that contains the field names. These will become the keys (properties) of the objects in the JSON output.
3. From the editing page of your Google Spreadsheet, go to File > Publish to the web..., choose the sheet you want to publish from the dropdown menu, and click the "Publish" button.
4. Copy *only the spreadsheet id* from the input box that appears; e.g. https://docs.google.com/spreadsheets/d/**1R8ZCNiUyZSC1CqpjMn-nBlRjwMJu3T3iZz7TkDbEx3k**/pubhtml
5. Make a request to http(s)://[your-server.com]/api/v1/sheet/[**spreadsheet-id**]

Requests are cached for 1 minute. You can change this value in `routes.js`, along with the CSV parsing settings which will affect the format of the JSON output.
