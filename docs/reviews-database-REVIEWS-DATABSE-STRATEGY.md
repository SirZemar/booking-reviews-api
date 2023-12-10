# Get only new reviews rates

## intro

The purpose of this strategy is to prevent over use of puppeteer by caching a timestamp of the the last time a scrape was done in the same booking page. 

## Business Strategy

## File structure
```ts
src/
+- api
  +- services/
    +- puppeteerReviews.ts
      - scrapeReviewRatesFromPage()
  +- utils/
    +- index.ts
      - convertBookingDateToTimestamp()
+- data
  +- reviewRates
    +- reviewRates.service.ts
      - getTimestampById()
    +- index.ts
```
## Workflow

- A http request is done with the route {function-domain}/pageName
- The api controllers/reviewRates.ts (`reviewRatesController`) gets param pageName and passes to function (`getReviewRates`) from services/reviewRates.ts
- This function launch the puppeteer browser and closes it when finish
- Function also calls services/puppeteerReviews.ts (`goToReviewListPage`) and goes to booking reviews list page
- Then a number of the total reviews is scraped with services/puppeteerReviews.ts (`scrapeNumberOfTotalReviewsPages`)
- From here, function (`scrapeReviewRatesFromPage`) from services/puppeteerReviews.ts will be call each time per booking list pages
- Function gets an array of all elements with class `review_list_new_item_block`, which should be equal or less than 10
- Loop the elements and get text content for the class `c-review-block__date` and compare with timestamp. 
  - Date format example (Comentário: 14 de setembro, 2023).
- When older than the timestamp, return index number from 0 to v 9 and 10 when not found
- Get text content of all elements with class `bui-review-score__badge` and splice the array to keep only until the index returned

## Data modeling

reviews/:pageName

### Reviews

```ts
{
  rates: number[],
  lastCheck: Timestamp,
}
```

## Actions

### Scrape reviews from booking with puppeteer

`services/reviewRates.ts/getReviewRates()`


