var expect = chai.expect;
window.__webSqlDebugModeOn = true;

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
      var db = openDatabase("Todo", "Ignored db version", "Ignored displayName",
                    dbSize,
                    function () {
                      expect(db.name).to.equal("Todo");
                      done();
                    });
    });
    
  });

  describe("transaction", function () {
    var db = null;
    before(function (done) {
      var dbSize = 5 * 1024 * 1024; // 5MB
      // open database
      db = openDatabase("Todo", "Ignored db version", "Ignored displayName",
                    dbSize,
                    function () {
                      done();
                    });
    });

    it("should insert and select", function (done) {
      this.timeout(4000);

      function step1(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)', [],
            function (tx, res) { step2(tx) },
            function (tx, err) { done(err); });
      }

      function step2(tx) {
        tx.executeSql('INSERT INTO foo (id, text) VALUES (?, ?)', [1, "foobar"],
            function (tx, res) { step3(tx); },
            function (tx, err) { done(err); });
      }

      function step3(tx) {
        tx.executeSql('SELECT * FROM foo', [], function (tx, res) {
          expect(res.rows[0].text).to.equal("foobar");
        });
      }

      db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS foo', [],
          function (tx, res) { step1(tx); },
          function (tx, err) { done(err); });
      },
      function (err) {
        done(err);
      },
      function () {
        done();
      });
    });

    it("should work 2", function (done) {

      this.timeout(4000);

      function step1(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)', [],
            function (tx, res) { step2(tx) },
            function (tx, err) { done(err); });
      }

      function step2(tx) {
        tx.executeSql('INSERT INTO foo (id, text) VALUES (?, ?)', [1, "foobar"],
            function (tx, res) { step3(tx); },
            function (tx, err) { done(err); });
      }

      function step3(tx) {
        tx.executeSql('SELECT * FROM foo', [], function (tx, res) {
          expect(res.rows[0].text).to.equal("foobar");
        });
      }

      function step4() {
        db.transaction(function (tx) {
          tx.executeSql('DROP TABLE IF EXISTS foo', [],
            function (tx, res) { step1(tx); },
            function (tx, err) { done(err); });
        },
      function (err) {
        done(err);
      },
      function () {
        done();
      });
      }

      function step0() {
        db.transaction(function (tx) {
          tx.executeSql('DROP TABLE IF EXISTS foo', [],
            function (tx, res) { step1(tx); },
            function (tx, err) { done(err); });
        },
        function (err) {
          done(err);
        },
        function () {
          step4();
          done();
        });
      }

      step0();

    });
    

    it("should work 2 (re-open db)", function (done) {

      var dbSize = 5 * 1024 * 1024; // 5MB
      // open database
      var db = openDatabase("Todo", "Ignored db version", "Ignored displayName",
                    dbSize,
                    function () {
                      step0();
                    });
      this.timeout(4000);

      function step1(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)', [],
            function (tx, res) { step2(tx) },
            function (tx, err) { done(err); });
      }

      function step2(tx) {
        tx.executeSql('INSERT INTO foo (id, text) VALUES (?, ?)', [1, "foobar"],
            function (tx, res) { step3(tx); },
            function (tx, err) { done(err); });
      }

      function step3(tx) {
        tx.executeSql('SELECT * FROM foo', [], function (tx, res) {
          expect(res.rows[0].text).to.equal("foobar");
        });
      }

      function step4() {
        db.transaction(function (tx) {
          tx.executeSql('DROP TABLE IF EXISTS foo', [],
            function (tx, res) { step1(tx); },
            function (tx, err) { done(err); });
        },
      function (err) {
        done(err);
      },
      function () {
        done();
        });
      }

      function step0() {
        db.transaction(function (tx) {
          tx.executeSql('DROP TABLE IF EXISTS foo', [],
            function (tx, res) { step1(tx); },
            function (tx, err) { done(err); });
        },
        function (err) {
          done(err);
        },
        function () {
          step4();
          done();
        });
      }

    });
    
    it("should insert and select 2", function (done) {
      this.timeout(4000);

      function step1(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)', [],
            function (tx, res) { step2(tx) },
            function (tx, err) { done(err); });
      }

      function step2(tx) {
        tx.executeSql('INSERT INTO foo (id, text) VALUES (?, ?)', [1, "foobar"],
            function (tx, res) { step3(tx); },
            function (tx, err) { done(err); });
      }

      function step3(tx) {
        tx.executeSql('SELECT * FROM foo', [], function (tx, res) {
          expect(res.rows[0].text).to.equal("foobar");
        });
      }

      db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS foo', [],
          function (tx, res) { step1(tx); },
          function (tx, err) { done(err); });
      },
      function (err) {
        done(err);
      },
      function () {
        done();
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