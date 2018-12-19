import { setupTests } from '../steps/base-test-steps';

describe('Tasks', function() {
  const utils = setupTests(this);

  describe('Installation', async function() {
    it('should be possible to create an installation task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Then  */ await utils().system.server_returned_success();
    });
  });
});
