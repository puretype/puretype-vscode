# puretype README

This repository is the initial VSCode extension for interfacing with the PureType backend, which produces a list of style and form issues (and optionally, suggestions) for code in a given language.

Elixir is the only language initially supported, but other languages will be registered in future, based on a list provided by the backend.

It includes functionality to:
- authenticate with the PureType backend using VSCode dialogs and external URI handlers
- display issues using a hover provider
- display suggestions using a code action provider
- functionality to submit code to the backend for evaluation using GraphQL and cache files as necessary

Ideally most of this functionality would be placed in a local process speaking [Language Server Protocol](https://en.wikipedia.org/wiki/Language_Server_Protocol), to ensure compatability between many different IDEs, but this will be sufficient for a first version.

## Copyright and License

Copyright (c) 2024 PureType Systems

This code is released under the [MIT License](./LICENSE).
