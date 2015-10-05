require(['configTest'], function() {
    require(['contactJS'], function (contactJS) {
        QUnit.test("translationTest.js", function (assert) {
            var discoverer = new contactJS.Discoverer(null, null, [
                [
                    ["CI_TEST_1", "INTEGER"],
                    ["CI_TEST_2", "INTEGER"]
                ],
                [
                    ["CI_TEST_1", "INTEGER"],
                    ["CI_TEST_4", "INTEGER", [["CP_TEST_NAME", "STRING", "CP_VALUE"]]]
                ]
            ]);

            var attribute1 = discoverer.buildContextInformation("CI_TEST_1", "INTEGER");
            var attribute2 = discoverer.buildContextInformation("CI_TEST_2", "INTEGER");
            var attribute3 = discoverer.buildContextInformation("CI_TEST_3", "INTEGER");
            var attribute4 = discoverer.buildContextInformation("CI_TEST_4", "INTEGER", [["CP_TEST_NAME", "STRING", "CP_VALUE"]]);

            assert.ok(attribute1.isKindOf(attribute2), attribute1+" == "+attribute2);
            assert.notOk(attribute1.isKindOf(attribute3), attribute1+" != "+attribute3);

            assert.ok(attribute1.isKindOf(attribute4), attribute1+" == "+attribute4);
        });
    });
});

