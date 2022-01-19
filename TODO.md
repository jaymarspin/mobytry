# Fixes

## Components

- components inside a module shouldnt need to be its own module
  - that allows you to keep to one top level module for routing and simplify the main routing module
- label your tabs for code clarity
- components in the tab can reference its own module, e.g. tabs route to Contact, Opportunity, Home modules etc.

## Routing

- clean up routing. the top level routing should not contain child routes

## Contact

- what is `getCurrContactArrLength` for? why do we need it?
- why does `searchByName` have infinite scroll as a boolean input?
- why does `getContactsByName` have a query with no name?
- `getContactByPhoneAndName`, why not we call the individual APIs and then merge the results?

