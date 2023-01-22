# Welcome to git-repo 👋

<center>

![Prerequisite][prerequisite_badge]
[![Maintenance][maintenance_badge]][maintenance_badge_url]
![License: (MIT OR Beerware)][license_badge]
[![Changelog][changelog_badge]][changelog_badge_url]

</center>

[prerequisite_badge]: https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg
[maintenance_badge]: https://img.shields.io/badge/Maintained%3F-yes-green.svg
[maintenance_badge_url]: https://github.com/rdeville-public/git-repo/graphs/commit-activity
[license_badge]: https://img.shields.io/badge/license-MIT%20OR%20Beerware-blue
[changelog_badge]: https://img.shields.io/badge/changelog-semantic%20release%20gitmoji-yellow
[changelog_badge_url]: https://github.com/momocow/semantic-release-gitmoji

> A [Pulumi][pulumi] program to manage Git Repo across multiple hosting
> services.

[pulumi]: https://www.pulumi.com/

## 📌 Prerequisites

  * node >=18.0.0
  * npm >= 8.0 OR yarn >= 1.22.0

## ⚙️ Install

To install dependencies to use the program :

```bash
yarn install
# or
npm install
```

## 🚀 Usage

This project rely on pulumi and its stacks.

First, you will need to setup your backend storage to store the state of the
deployment, see [Pulumi - State and Backend][pulumi_state] documentation for
more information.

Once done, you will need to create your stack with the following command :

```bash
pulumi stack init <name_of_your_stack>
```

This will ask you a password to be able to store secret configuration within
your stack. Once done, a file `Pulumi.name_of_your_stack.yaml` should be
present. This folder will store your stack configuration. For more information
about Pulumi stacks management, see [Pulumi -Stacks][pulumi_stack]
documentation.

Next step is now to configure your git repo configuration and deployment within
this stack. Multiple example of such stacks are provided in the folder
`stack-example/` :

  * `Pulumi.example.yaml`: A basic example with comment to help you understand
    the structure of the stack configuration.
  * `Pulumi.example_full.yaml`: An example with almost all possible
    configuration entry with comment.
  * `Pulumi.example_minimum.yaml`: A minimalist example without comment.
  * `Pulumi.example_target.yaml`: (DO NOT USE) This file provide you a full
    example of what will be the stack configuration once everything will be
    supported (groups, subgroups, repos, labels, hook, etc., with multiple
    provider).

Once done, you can deploy your stack (and create your groups and repo) with the
following command :

```bash
pulumi up
```

[pulumi_state]: https://www.pulumi.com/docs/intro/concepts/state/
[pulumi_stack]: https://www.pulumi.com/docs/intro/concepts/stack/

## ✅ Run tests

```bash
yarn test && yarn lint
# or
npm test && npm lint
```

## 👤 Author

📧 [**Romain Deville \<code@romaindeville.fr\>**][mail]

  * Website: [https://romaindeville.fr][website]
  * Github: [@rdeville][github_profile]
  * Gitlab: [@r.deville][gitlab_profile]
  * Framagit: [@rdeville][framagit_profile]

[mail]: mailto:code@romaindeville.fr
[website]: https://romaindeville.fr
[github_profile]: https://github.com/rdeville
[gitlab_profile]: https://gitlab.com/r.deville
[framagit_profile]: https://framagit.org/rdeville

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page][issues_pages]. You can also take a
look at the [contributing guide][contributing_guide].

[issues_pages]: https://github.com/rdeville-public/git-repo/-/issues
[contributing_guide]: https://github.com/rdeville-public/git-repo/blob/master/CONTRIBUTING.md

## ⭐️ Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022-2023 [Romain Deville](https://github.com/rdeville).

This project is [MIT][mit_license] **OR** [Beerware][beerware_license] licensed.

[mit_license]: https://github.com/rdeville-public/git-repo/blob/master/LICENSE.MIT
[beerware_license]: https://github.com/rdeville-public/git-repo/blob/master/LICENSE.BEERWARE
