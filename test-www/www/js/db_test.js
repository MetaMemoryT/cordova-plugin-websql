var expect = chai.expect;
var db = null;
debugger;

function fragment(html) {
  var args = arguments
    , div = document.createElement('div')
    , i = 1;

  div.innerHTML = html.replace(/%([se])/g, function (_, type) {
    switch (type) {
      case 's': return String(args[i++]);
      case 'e': return escape(args[i++]);
    }
  });

  return div.firstChild;
}

describe("Db", function () {
  describe("openDatabase", function () {
    it("should open a new empty database", function (done) {
      var dbSize = 5 * 1024 * 1024; // 5MB
      // open database
      db = openDatabase("Todo", "Ignored db version", "Ignored displayName",
      dbSize,
      function () {
        expect(1).to.equal(1);
        done();
      },
      function () {
        expect(1).to.equal(2);
        done();
      });
    });
  });
  describe("transaction", function () {
    it("should insert and select", function (done) {
      this.timeout(3000);
      db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS foo', [],
          function (tx, res) { },
          function (tx, err) { console.log("err: ", err); });
        tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)', [],
            function (tx, res) { },
            function (tx, err) { console.log("err: ", err); });
        tx.executeSql('INSERT INTO foo (id, text) VALUES (?, ?)', [1, "foobar"],
            function (tx, res) { },
            function (tx, err) { console.log("err: ", err); });
        tx.executeSql('SELECT * FROM foo', [], (function (tx, res) {
          expect(res.rows[0].text).to.equal("foobar");
          debugger;
          done();
        }),
        function (tx, err) {
          expect(1).to.equal(2);
          console.log("err: ", err);
          done();
        });
      });
    });

    it("should insert and select 2", function (done) {
      this.timeout(3000);
      db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS foo', [],
          function (tx, res) { },
          function (tx, err) { console.log("err: ", err); });
        tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)', [],
            function (tx, res) { },
            function (tx, err) { console.log("err: ", err); });
        tx.executeSql('INSERT INTO foo (id, text) VALUES (?, ?)', [1, "foobar"],
            function (tx, res) { },
            function (tx, err) { console.log("err: ", err); });
        tx.executeSql('SELECT * FROM foo', [], (function (tx, res) {
          debugger;
          expect(res.rows[0].text).to.equal("foobar");
          done();
        }),
        function (tx, err) {
          expect(1).to.equal(2);
          console.log("err: ", err);
          done();
        });
      });
    });

  });
});

describe("dom requirements", function () {
  // winstore-jscompat.js issue
  it("should return the correct dom tree", function () {
    var dom = fragment('<ul id="mocha-stats"><li class="progress"><canvas width="40" height="40"></canvas></li><li class="passes"><a href="#">passes:</a> <em>0</em></li><li class="failures"><a href="#">failures:</a> <em>0</em></li><li class="duration">duration: <em>0</em>s</li></ul>');
    expect(dom.firstChild.nodeName).to.equal('LI');
  });
});