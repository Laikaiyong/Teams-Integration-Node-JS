import { module, test } from 'qunit';
import { setupTest } from 'teams-node/tests/helpers';

module('Unit | Service | teams', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:teams');
    assert.ok(service);
  });
});
