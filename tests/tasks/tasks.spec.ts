import { setupTests } from '../steps/base-test-steps';
import { expect } from 'chai';

describe('Tasks', function() {
  const utils = setupTests(this);

  describe('Installation', function() {
    it('should be possible to create an installation task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should be possible to schedule an installation task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should be possible to complete the full installation lifecycle', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_inprogress();
      /* When  */ await utils().taskTest.task_is_closed();
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should not be possible to close a scheduled installation task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_closed();
      /* Then  */ await utils().system.server_returned_error();
    });
  });

  describe('Quote', function() {
    it('should be possible to create a quote task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'quote' });
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should be possible to complete the full quote lifecycle', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'quote' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_inprogress();
      /* When  */ await utils().taskTest.task_is_closed();
      /* Then  */ await utils().system.server_returned_success();
    });
  });

  describe('Repair', function() {
    it('should be possible to create a repair task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'repair' });
      /* Then  */ await utils().system.server_returned_success();
    });
  });

  describe('Deinstallation', function() {
    it('should be possible to create a deinstallation task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'deinstallation' });
      /* Then  */ await utils().system.server_returned_success();
    });
  });

  describe('Rich data', function() {
    it('should persist customer and site data on creation', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({
        type: 'installation',
        customer: { name: 'John Smith', phone: '+44123456789', email: 'john@example.com' },
        site: { address: '10 Downing Street', city: 'London', postcode: 'SW1A 2AA' }
      });
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should not be possible to schedule without a scheduledDate', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_updated_raw({ status: 'scheduled', userId: 'user:id:1' });
      /* Then  */ await utils().system.server_returned_error();
    });
  });

  describe('Delete', function() {
    it('should be possible to delete a new task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_deleted();
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should be possible to delete a scheduled task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_deleted();
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should be possible to delete an inprogress task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_inprogress();
      /* When  */ await utils().taskTest.task_is_deleted();
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should not be possible to delete a closed task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_inprogress();
      /* When  */ await utils().taskTest.task_is_closed();
      /* When  */ await utils().taskTest.task_is_deleted();
      /* Then  */ await utils().system.server_returned_error();
    });
  });

  describe('Reschedule', function() {
    it('should be possible to reschedule a scheduled task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_rescheduled();
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should be possible to reschedule an inprogress task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_inprogress();
      /* When  */ await utils().taskTest.task_is_rescheduled();
      /* Then  */ await utils().system.server_returned_success();
    });

    it('should be possible to reschedule and then re-schedule again', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'quote' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_rescheduled();
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* Then  */ await utils().system.server_returned_success();
    });
  });

  describe('List', function() {
    it('should return an empty list when no tasks exist', async function() {
      /* When  */ const result: any = await utils().taskTest.list_tasks();
      /* Then  */ await utils().system.server_returned_success();
      expect(result.tasks).to.be.an('array').with.lengthOf(0);
      expect(result.total).to.eq(0);
    });

    it('should list all active tasks', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'quote' });
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'repair' });
      /* When  */ const result: any = await utils().taskTest.list_tasks();
      /* Then  */ await utils().system.server_returned_success();
      expect(result.tasks).to.be.an('array').with.lengthOf(3);
      expect(result.total).to.eq(3);
    });

    it('should filter tasks by status', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Given */ await utils().taskTest.task_is_scheduled();
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'quote' });
      /* When  */ const result: any = await utils().taskTest.list_tasks({ status: 'new' });
      /* Then  */ await utils().system.server_returned_success();
      expect(result.tasks).to.be.an('array').with.lengthOf(1);
      expect(result.tasks[0].type).to.eq('quote');
    });

    it('should filter tasks by type', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'quote' });
      /* When  */ const result: any = await utils().taskTest.list_tasks({ type: 'quote' });
      /* Then  */ await utils().system.server_returned_success();
      expect(result.tasks).to.be.an('array').with.lengthOf(1);
    });

    it('should not include deleted tasks', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Given */ await utils().taskTest.task_is_deleted();
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'quote' });
      /* When  */ const result: any = await utils().taskTest.list_tasks();
      /* Then  */ await utils().system.server_returned_success();
      expect(result.tasks).to.be.an('array').with.lengthOf(1);
    });

    it('should support pagination', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'quote' });
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'repair' });
      /* When  */ const result: any = await utils().taskTest.list_tasks({ limit: '2' });
      /* Then  */ await utils().system.server_returned_success();
      expect(result.tasks).to.be.an('array').with.lengthOf(2);
      expect(result.total).to.eq(3);
    });
  });

  describe('Notes', function() {
    it('should be possible to add a note to a new task', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ const result: any = await utils().taskTest.add_note('Initial inspection notes');
      /* Then  */ await utils().system.server_returned_success();
      expect(result.notes).to.be.an('array').with.lengthOf(1);
      expect(result.notes[0].text).to.eq('Initial inspection notes');
      expect(result.notes[0].author).to.eq('dev:user');
      expect(result.notes[0].createdAt).to.exist;
    });

    it('should be possible to add multiple notes', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.add_note('First note');
      /* When  */ const result: any = await utils().taskTest.add_note('Second note');
      /* Then  */ await utils().system.server_returned_success();
      expect(result.notes).to.be.an('array').with.lengthOf(2);
      expect(result.notes[0].text).to.eq('First note');
      expect(result.notes[1].text).to.eq('Second note');
    });

    it('should be possible to add a note to a closed task', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Given */ await utils().taskTest.task_is_scheduled();
      /* Given */ await utils().taskTest.task_is_inprogress();
      /* Given */ await utils().taskTest.task_is_closed();
      /* When  */ const result: any = await utils().taskTest.add_note('Follow-up observation');
      /* Then  */ await utils().system.server_returned_success();
      expect(result.notes).to.be.an('array').with.lengthOf(1);
    });

    it('should not be possible to add a note to a deleted task', async function() {
      /* Given */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* Given */ await utils().taskTest.task_is_deleted();
      /* When  */ await utils().taskTest.add_note('Should fail');
      /* Then  */ await utils().system.server_returned_error();
    });
  });

  describe('Invalid transitions', function() {
    it('should not be possible to move directly from new to closed', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_closed();
      /* Then  */ await utils().system.server_returned_error();
    });

    it('should not be possible to move directly from new to inprogress', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'installation' });
      /* When  */ await utils().taskTest.task_is_inprogress();
      /* Then  */ await utils().system.server_returned_error();
    });

    it('should not be possible to transition from a closed task', async function() {
      /* When  */ await utils().taskTest.new_task_is_created({ type: 'repair' });
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* When  */ await utils().taskTest.task_is_inprogress();
      /* When  */ await utils().taskTest.task_is_closed();
      /* When  */ await utils().taskTest.task_is_scheduled();
      /* Then  */ await utils().system.server_returned_error();
    });
  });
});
