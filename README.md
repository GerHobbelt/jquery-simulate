# jQuery.simulate()

Simulate events to help unit test user interactions.


Project Status
--------------

jquery-simulate is in use by projects of the jQuery Foundation, but isn't under active development. Usually issues are addressed by members of the jQuery UI team when they're affected, while other pull requests linger and get stale. We hesitate to put more time into this project, since its future is unclear.

Specifically we're hoping for the WebDriver API to become a much better solution. We're currently experiementing with that, via [Intern](http://theintern.io/) on [PEP](https://github.com/jquery/pep)).

That said, this project is stable and should work fine. Just keep the above in mind before using it.


How to build
------------

First, get a copy of the git repo by running:

```shell
git clone git://github.com/GerHobbelt/jquery-simulate.git
```

Enter the directory and install the node dependencies:

```shell
cd jquery-simulate
npm install
```

Make sure you have `grunt` installed by testing:

```shell
grunt -version
```

If you don't yet have grunt installed:

```sh
npm install -g grunt-cli
```

Now you can run `grunt` to run the build+test process:

```shell
grunt
```


How to test
-----------

- Open the `test/index.html` in a browser.

- Or to run tests locally without a browser, run `grunt`, and this will run the tests in PhantomJS.

