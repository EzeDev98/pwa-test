  // your-common-script.js

  // Function to dynamically create the sync reminder modal
  function createSyncReminderModal() {
    const modalHtml = `
      <div class="modal fade" id="syncReminderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-body">
                      <div class="text-center mb-4">
                          <h6 class="mb-3">Sync Reminder</h6>
                          <small class="small bal ">It’s past 6 hours since your last syncing. Please sync your transactions
                              before proceeding.</small>
                      </div>
                      <div>
                          <button type="button" class="btn w-100 rounded-5 btn-black my-3" data-bs-dismiss="modal">Sync
                              Now</button>
                          <button type="button" class="btn w-100 btn-outline-secondary rounded-5" data-bs-dismiss="modal">Exit</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `;

    // Append the modal HTML to the body
    $('body').append(modalHtml);
}




function checkSyncReminder() {

    function getLastSyncTime() {
        return localStorage.getItem("lastSyncTime");
    }

    const lastSyncTime = getLastSyncTime();

    console.log('sync time:', lastSyncTime);

    if (lastSyncTime) {
        // Compare the last sync time with the current time
        const currentTime = new Date();
        const lastSyncDateTime = new Date(lastSyncTime);
        const timeDiffInHours = (currentTime - lastSyncDateTime) / (1000 * 60 * 60);

        // Show the reminder if 6 hours have passed since the last sync
        if (timeDiffInHours >= 6) {
            // Check if the modal is already created, if not, create it
            if (!$('#syncReminderModal').length) {
                createSyncReminderModal();
            }

            // Show the sync reminder modal
            $('#syncReminderModal').modal('show');
        }
    }
}

// Set interval to check for the reminder every 6hrs
setInterval(checkSyncReminder, 1000 * 60 * 60 * 6);
