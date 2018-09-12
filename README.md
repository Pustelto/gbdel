# gbdel

Tiny node.js shell script for interactive deletion of local git branches with ease

## Install

You have to have node installed (tested on version 8.11.x) and git (obviously).

Just run `npm install -g gbdel` and you are done.

## Usage

Type `gbdel` command in git repository. Move between options via up and down arrows, toggle branches with space keyboard. Confirm deletion by enter.

## Settings

You can customize few thing in the script via shell variables:

`GIT_BRANCH_CLEANER_BLACKLIST` - this is comma separated list of branches you do not want to display in the interactive dialog (eg. `master,deploy,development`). Default value is `master`.

`GIT_BRANCH_CLEANER_MERGED_BASE` - name of branch script should use to decide which branches are already merged. Default is `master`.

`GIT_BRANCH_CLEANER_PAGESIZE` - max. number of branches to show in dialog at once. Other branches can be accessed via keyboard arrows. Default is 25 (should be more than enough).

## Contribution

If you have any questions, new great ideas or just constructive feedback feel free to open issue or get in touch with me.

## License

MIT
