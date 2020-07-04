# Solution to cq assignment

This is my solution to the assignment provided.

In the second point it doesn't mention it, but I suppossed that I also should filter the interests to those only with normal status.
Also, the total audience reported is the addition of all the individual audiences thus it contains duplicates.

## Test

`npm run test`

Test results can be found in `coverage/lcov-report/index.html`

## Setup

create a file called `.env` in the root folder, copy the contents from `.env.sample`, and write your facebook token.

```
npm install
npm run build
npm start
```

## Next steps

- More tests
- Quering the interest's status everytime it's a waste of resources since those won't change often. I would start by adding a service to keep an updated cache.
- What's up with that coverage? MORE TESTS!

# Setup

```

npm install
npm start

```

# Assignment

Create 2 endpoints to get Facebook ad interests information.

You can find documentation on how to get this data from Facebook here:
https://developers.facebook.com/docs/marketing-api/audiences/reference/targeting-search/

#### 1. Create a GET endpoint that returns a JSON array with all Facebook interests (id + name)

In the docs search for type=adTargetingCategory&class=interests

E.g.

```

GET /interests
[
{"id":"6007828099136", "name":"Luxury goods"},
{"id":"6009422452499", "name":"Home and garden"}
...
]

```

Notes:
Some interests are deprecated/not deliverable. To verify the status, use the Targeting Status endpoint (search for type=targetingoptionstatus).
Only return ad interests with status "NORMAL"

#### 2. Create a GET endpoint that returns the total audience size for a provided set of ids

E.g.

```

GET /interests/audience-size?ids=6007828099136,6009422452499,...
{
"totalAudienceSize": 12311525
}

```

```

```
