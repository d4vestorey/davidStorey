//preloader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
  });


$(document).ready(function() {
    // retrieve all records on page load
    populateTable();
    getAllDepartments();
    getAllLocations();
    populateDepartmentTable();
    populateLocationTable();
});


let selectedDeptValues = [];
let selectedLocationValues = [];

//Populate the 3 tables with data
function populateTable () {
    $.ajax({
        type: "GET",
        url: "libs/php/getAll.php",
        dataType: "json",
        success: function(data) {

            console.log(data);
            $.each(data.data, function(key, value) {
                $("#records").append("<tr data-row-id='" + value.id + "'class='employee'><td>" + value.lastFirst + "</td><td class='d-sm-none d-none d-md-table-cell'>" + value.jobTitle + "</td><td data-dept='" + value.deptID + "' class='d-sm-none d-none d-md-table-cell'>" + value.department + "</td><td class='d-sm-none d-none d-md-table-cell'>" + value.email + "</td><td class='d-sm-none d-none d-lg-table-cell'>" + value.location + "</td><td><button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#editRecordModal' class='btn btn-primary editRecModalBtn'><i class='fa fa-user-pen fa-xs'></i></button></td><td> <button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#deleteRecordModal' class='btn btn-danger delRecModalBtn'><i class='fa fa-trash fa-xs'></i></button></td></tr>");
                });
                
                //functionality for record deletion buttons
                const delButtons = document.querySelectorAll('.delRecModalBtn');                    
                delButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const rowId = button.dataset.rowId;
                    console.log(rowId);
                    let firstNameData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(1)`);
                    let lastNameData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(2)`);
                    let jobTitleData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(3)`);
                    let deptData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(4)`);
                    let emailData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(5)`);
                    document.getElementById('idDel').value = rowId;
                    document.getElementById('firstNameDel').value = firstNameData.innerHTML;
                    document.getElementById('lastNameDel').value = lastNameData.innerHTML;
                    document.getElementById('jobTitleDel').value = jobTitleData.innerHTML;
                    document.getElementById('emailDel').value = emailData.innerHTML;
                    document.getElementById('deptDel').value = deptData.innerHTML;
                });
                });

                //functionality for record edit buttons
                const editButtons = document.querySelectorAll('.editRecModalBtn');                    
                editButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const rowId = button.dataset.rowId;
                    console.log(rowId);
                    let editFirstNameData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(1)`);
                    let editLastNameData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(2)`);
                    let editJobTitleData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(3)`);
                    let editDeptData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(4)`);
                    let editEmailData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(5)`);
                    console.log(editDeptData.innerHTML);
                    document.getElementById('idEdit').value = rowId;
                    document.getElementById('firstNameEdit').value = editFirstNameData.innerHTML;
                    document.getElementById('lastNameEdit').value = editLastNameData.innerHTML;
                    document.getElementById('jobTitleEdit').value = editJobTitleData.innerHTML;
                    document.getElementById('emailEdit').value = editEmailData.innerHTML;
                    let deptCode = editDeptData.getAttribute("data-dept");
                    let deptSelect = document.getElementById('deptEdit');
                    for (let i = 0; i < deptSelect.options.length; i++) {
                    if (deptSelect.options[i].value === deptCode) {
                        deptSelect.options[i].selected = true;
                        break;
                    }
                    }
                });
                });
            }
        });
};

function populateDepartmentTable () {
    $.ajax({
        type: "GET",
        url: "libs/php/getLocationsAndDepartments.php",
        dataType: "json",
        success: function(data) {

            console.log(data);
            console.log($("#departmentRecords"));
            
            $.each(data, function(key, value) {
                $("#departmentRecords").append("<tr data-row-id='" + value.deptID + "' class='department'><td>" + value.deptName + "</td><td data-locationId='" + value.locationID + "'>" + value.locationName + "</td><td><button data-row-id='" + value.deptID + "'data-bs-toggle='modal' data-bs-target='#editDepartmentModal' class='btn btn-primary editDeptRecModalBtn'><i class='fa fa-user-pen fa-xs'></i></button></td><td><button data-row-id='" + value.deptID + "'class='btn btn-danger delDeptRecModalBtn'><i class='fa fa-trash fa-xs'></i></button></td></tr>");
            });
            }
        });
};

function populateLocationTable () {
    $.ajax({
        type: "GET",
        url: "libs/php/getAllLocations.php",
        dataType: "json",
        success: function(data) {

            console.log(data);
            
            $.each(data, function(key, value) {
                $("#locationRecords").append("<tr data-row-id='" + value.id + "' class='location'><td>" + value.name + "</td><td><button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#editLocationModal' class='btn btn-primary editLocationRecModalBtn'><i class='fa fa-user-pen fa-xs'></i></button></td><td><button data-row-id='" + value.id + "' class='btn btn-danger delLocationRecModalBtn'><i class='fa fa-trash fa-xs'></i></button></td></tr>");
            });
            }
        });
};


//free text search funtionality
const employee = document.querySelectorAll('.employee');

const employeeSearch = () =>{
   let input = document.getElementById('searchEmployee');
   let filter = input.value.toUpperCase();
   let table = document.getElementById('records');
   let tr = table.getElementsByTagName('tr');
   let td;
   let i;
   let txtValue1;
   let txtValue2;
   let txtValue3;
   let txtValue4;
   let txtValue5;
   let txtValue6;

   for (i = 0; i < tr.length; i++) {
    td1 = tr[i].getElementsByTagName("td")[0];
    td2 = tr[i].getElementsByTagName("td")[1];
    td3 = tr[i].getElementsByTagName("td")[2];
    td4 = tr[i].getElementsByTagName("td")[3];
    td5 = tr[i].getElementsByTagName("td")[4];
    td6 = tr[i].getElementsByTagName("td")[5];
    if (td1 || td2 || td2 || td4) {
      txtValue1 = td1.textContent || td1.innerText;
      txtValue2 = td2.textContent || td2.innerText;
      txtValue3 = td3.textContent || td3.innerText;
      txtValue4 = td4.textContent || td4.innerText;
      txtValue5 = td5.textContent || td5.innerText;
      txtValue6 = td6.textContent || td6.innerText;
      if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1 || txtValue3.toUpperCase().indexOf(filter) > -1 || txtValue4.toUpperCase().indexOf(filter) > -1 || txtValue5.toUpperCase().indexOf(filter) > -1 || txtValue6.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

}

searchEmployee.addEventListener('input', (e) =>{
    employeeSearch(e.target.value.toUpperCase());
});

//create, update and delete functions

//create new personnel record
const newPersonnelForm = document.getElementById('employeeRecordForm');
const newPersonnelModal = new bootstrap.Modal(document.querySelector('#staticBackdrop'));

function createNewPersonnelRecord(){
    $.ajax({
        type: "GET",
        url: "libs/php/insertPersonnel.php",
        dataType: "json",
        data:{
            firstName: $("#firstNameInput").val(),
            lastName: $("#lastNameInput").val(),
            jobTitle: $("#jobTitleInput").val(),
            email: $("#emailInput").val(),
            departmentID: $("#deptInput").val(),
            deptName: $("#deptInput option:selected").text(),
        },
        success: function(data) {

            customPersonnelAlert(data.status.code, data.status.description);

            newPersonnelModal.hide();
            newPersonnelForm.reset();
            populateTable();
        }
    });
};


//delete personnel record
const deletePersonnelRecordForm = document.getElementById('deletePersonnelRecordForm');
const deletePersonnelRecordModal = new bootstrap.Modal(document.querySelector('#deleteRecordModal'));

//delete personnel 
function deletePersonnelRecord() {
    
    $.ajax({
        type: "GET",
        url: "libs/php/deletePersonnel.php",
        dataType: "json",
        data:{
            id: $("#idDel").val(),
            firstName: $("#firstNameDel").val(),
            lastName: $("#lastNameDel").val(),
            jobTitle: $("#jobTitleDel").val(),
            email: $("#emailDel").val(),
            deptName: $("#deptDel").val(),
        },
        success: function(data) {
            
            customPersonnelAlert(data.status.code, data.status.description);
            
            let rowToDelete = document.querySelector(`#records tr[data-row-id="${data.data[0]}"]`);
            rowToDelete.remove();
            deletePersonnelRecordModal.hide();
        }
    });
};


///////////////////////// DELETE Personnel RECORD CALL ////////////////////////////////

// The modal "show" event is triggered when the $('#...').modal('show')
// is requested and executes before the modal is visible

$('#deleteRecordModal').on('show.bs.modal', function (e) {

    $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-row-id') // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
            
      var resultCode = result.status.code

      if (resultCode == 200) {

        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        
        $('#idDel').val(result.data.personnel[0].id);
        
        $('#firstNameDel').val(result.data.personnel[0].firstName);
        $('#lastNameDel').val(result.data.personnel[0].lastName);
        $('#jobTitleDel').val(result.data.personnel[0].jobTitle);
        $('#emailDel').val(result.data.personnel[0].email);
        $('#deptDel').val(result.data.personnel[0].name);

        $('#personnelConfirmDelMsg').append('Are you sure you want to delete the record for <b>' + result.data.personnel[0].firstName + ' ' + result.data.personnel[0].lastName + '</b>?');
        
        
      } else {

        $('#deleteRecordModal .modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#deleteRecordModal .modal-title').replaceWith("Error retrieving data");
    }
  });

});

//////////////////////////////////////////////////////////////

//Clears the appended delete confirmation question ready for the next delete button press
$('#deleteRecordModal').on('hidden.bs.modal', function () {
  
    $('#personnelConfirmDelMsg').empty();
    
  });


//edit personnel record
const editPersonnelRecordForm = document.getElementById('editPersonnelRecordForm');
const editPersonnelRecordModal = new bootstrap.Modal(document.querySelector('#editRecordModal'));

function editPersonnelRecord () {
    $.ajax({
        type: "POST",
        url: "libs/php/editPersonnel.php",
        dataType: "json",
        data:{
            id: $("#idEdit").val(),
            firstName: $("#firstNameEdit").val(),
            lastName: $("#lastNameEdit").val(),
            jobTitle: $("#jobTitleEdit").val(),
            email: $("#emailEdit").val(),
            departmentID: $("#deptEdit").val(),
            deptName: $("#deptEdit option:selected").text(),
        },
        success: function(data) {

            console.log(data);            
            customPersonnelAlert(data.status.code, data.status.description);
            clearTableRows();
            populateTable();
            editPersonnelRecordModal.hide();
        }
    });
};


/////////////////// EDIT PERSONNEL RECORD ON.SHOW TO POPULATE MODAL WITH INFORMATION FROM DB /////////////////////////

// The modal "show" event is triggered when the $('#...').modal('show')
// is requested and executes before the modal is visible

$('#editRecordModal').on('show.bs.modal', function (e) {

    $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-row-id') // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
            
      var resultCode = result.status.code

      if (resultCode == 200) {

        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        
        $('#idEdit').val(result.data.personnel[0].id);
        
        $('#firstNameEdit').val(result.data.personnel[0].firstName);
        $('#lastNameEdit').val(result.data.personnel[0].lastName);
        $('#jobTitleEdit').val(result.data.personnel[0].jobTitle);
        $('#emailEdit').val(result.data.personnel[0].email);
        
        $('#deptEdit option:selected').text(result.data.personnel[0].name);
        
        
      } else {

        $('#editRecordModal .modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editRecordModal .modal-title').replaceWith("Error retrieving data");
    }
  });

});

//////////////////////////////////////////////////////////////



//add new location
const addNewLocationForm = document.getElementById('addNewLocationForm');
const locationModal = new bootstrap.Modal(document.querySelector('#locationModal'));


function addNewLocation() {
    $.ajax({
        type: "POST",
        url: "libs/php/insertLocation.php",
        dataType: "json",
        data:{
            location: $("#newLocationInput").val(),
        },
        success: function(data) {

            customLocationAlert(data.status.code, data.status.description);
            clearTableRows();
            populateTable();
            clearLocationTableRows();
            populateLocationTable();
            clearLocationFilter();
            selectedLocationValues = [];
            getAllLocations();
            locationModal.hide();
            addNewLocationForm.reset();
        }
    });
};

//delete location
const deleteLocationForm = document.getElementById('deleteLocationForm');
const delLocationModal = new bootstrap.Modal(document.querySelector('#delLocationModal'));

function deleteLocation(){
    $.ajax({
        type: "POST",
        url: "libs/php/deleteLocation.php",
        dataType: "json",
        data:{
            locationID: $("#locationIdDel").val(),
            name: $("#locationNameDel").val(),
        },
        success: function(data) {

            console.log(data);
            
            customLocationAlert(data.status.code, data.status.description);
            clearLocationTableRows();
            populateLocationTable ();
            clearLocationFilter();
            selectedLocationValues = [];
            getAllLocations();
            delLocationModal.hide();
            deleteLocationForm.reset();
        }
    });
};

/////////Check for location record dependancy on delete button click////////////

$(document).on('click','.delLocationRecModalBtn',function() {
   
    $.ajax({
      url: "libs/php/checkLocationUse.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: parseInt($(this).attr("data-row-id")) // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
        
        console.log(result);
        
        if (result.status.code == 200) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            icon: 'error',
            text: result.status.description});

          } else if (result.status.code == 100) {
            console.log(result);
            $('#locationIdDel').val(result.data[0].id);
            $('#locationNameDel').val(result.data[0].locationName); 
            
            delLocationModal.show();
          }
      },
    });
                             
  });


///////////////////////////////////

//edit location
const editLocationForm = document.getElementById('editLocationRecordForm');
const editLocationModal = new bootstrap.Modal(document.querySelector('#editLocationModal'));

function editLocation(){
    $.ajax({
        type: "POST",
        url: "libs/php/editLocation.php",
        dataType: "json",
        data:{
            locationID: $("#locationIdEdit").val(),
            locationName: $("#locationNameEdit").val(),
        },
        success: function(data) {

            console.log(data);
            
            customLocationAlert(data.status.code, data.status.description);
            clearLocationTableRows();
            clearTableRows();
            populateTable();
            populateLocationTable();
            clearLocationFilter();
            selectedLocationValues = [];
            getAllLocations();
            editLocationModal.hide();
        }
    });
};

/////////////////// EDIT LOCATION RECORD ON.SHOW TO POPULATE MODAL WITH INFORMATION FROM DB /////////////////////////

// The modal "show" event is triggered when the $('#...').modal('show')
// is requested and executes before the modal is visible

$('#editLocationModal').on('show.bs.modal', function (e) {

    $.ajax({
    url: "libs/php/getLocationByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-row-id') // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
            
      var resultCode = result.status.code

      if (resultCode == 200) {

        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result.data.deptName);
        
        $('#locationIdEdit').val(result.data[0].id);
        $('#locationNameEdit').val(result.data[0].locationName);
        
        
      } else {

        $('#editDepartmentModal .modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editDepartmentModal .modal-title').replaceWith("Error retrieving data");
    }
  });

});

//////////////////////////////////////////////////////////////


//add new department
const addNewDepartmentForm = document.getElementById('addNewDepartmentForm');
const departmentModal = new bootstrap.Modal(document.querySelector('#departmentModal'));

function addNewDepartment() {
    $.ajax({
        type: "POST",
        url: "libs/php/insertDepartment.php",
        dataType: "json",
        data:{
            locationID: $("#newDepartmentLocationInput").val(),
            locationName: $("#newDepartmentLocationInput option:selected").text(),
            deptName: $("#newDepartmentInput").val(),
        },
        success: function(data) {

            console.log(data);
            
            customDepartmentAlert(data.status.code, data.status.description);
            clearDeptTableRows();
            populateDepartmentTable();
            clearDepartmentFilter();
            selectedDeptValues = [];
            getAllDepartments();
            departmentModal.hide();
            addNewDepartmentForm.reset();
        }
    });
};


//delete department
const deleteDepartmentForm = document.getElementById('deleteDepartmentForm');
const delDepartmentModal = new bootstrap.Modal(document.querySelector('#delDepartmentModal'));

function deleteDepartment(){
    $.ajax({
        type: "POST",
        url: "libs/php/deleteDepartment.php",
        dataType: "json",
        data:{
            deptName: $("#deptNameDel").val(),
            deptID: $("#deptIdDel").val(),
        },
        success: function(data) {

            console.log(data);
            
            customDepartmentAlert(data.status.code, data.status.description);
            clearTableRows();
            populateTable();
            clearDeptTableRows();
            populateDepartmentTable();
            clearDepartmentFilter();
            selectedDeptValues = [];
            getAllDepartments();
            delDepartmentModal.hide();
            deleteDepartmentForm.reset();
        }
    });
};


/////////Check for department record dependancy on delete button click////////////

$(document).on('click','.delDeptRecModalBtn',function() {
   
    $.ajax({
      url: "libs/php/checkDepartmentUse.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: parseInt($(this).attr("data-row-id")) // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
        
        console.log(result);
        
        if (result.status.code == 200) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            icon: 'error',
            text: result.status.description});

          } else if (result.status.code == 100) {
            console.log(result);
            $('#deptIdDel').val(result.data[0].id);
            $('#deptNameDel').val(result.data[0].deptName); 
            $('#deptLocationDel').val(result.data[0].locationName);
            delDepartmentModal.show();
          }
      },
    });
                             
  });


///////////////////////////////////


//edit department
const editDepartmentForm = document.getElementById('editDepartmentRecordForm');
const editDepartmentModal = new bootstrap.Modal(document.querySelector('#editDepartmentModal'));

function editDepartment(){
    $.ajax({
        type: "POST",
        url: "libs/php/editDepartment.php",
        dataType: "json",
        data:{
            locationID: $("#deptLocationEdit").val(),
            deptName: $("#deptNameEdit").val(),
            deptID: $("#deptIdEdit").val(),
        },
        success: function(data) {

            console.log(data);
            
            customDepartmentAlert(data.status.code, data.status.description);
            clearDeptTableRows();
            clearTableRows();
            populateTable();
            populateDepartmentTable();
            clearDepartmentFilter();
            selectedDeptValues = [];
            getAllDepartments();
            editDepartmentModal.hide();
        }
    });
};


//////////// POPULATE EDIT DEPT MODAL WITH INFORMATION FROM DB ON OPEN ///////////////////

$('#editDepartmentModal').on('show.bs.modal', function (e) {

    $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-row-id') // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
            
      var resultCode = result.status.code

      if (resultCode == 200) {

        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result.data.deptName);
        
        $('#deptIdEdit').val(result.data[0].deptID);
        $('#deptNameEdit').val(result.data[0].deptName);
        $('#deptLocationEdit option:selected').text(result.data[0].locationName);
        $('#deptLocationEdit option:selected').val(result.data[0].locationID);
        
        
      } else {

        $('#editDepartmentModal .modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editDepartmentModal .modal-title').replaceWith("Error retrieving data");
    }
  });

});

//////////////////////////////////////////////////////////////


//helper functions
function clearTableRows() {
    $('#records tbody').empty();
};

function clearDeptTableRows() {
    $('#departmentRecords tbody').empty();
};

function clearLocationTableRows() {
    $('#locationRecords tbody').empty();
};

function clearLocationFilter() {
    $('#locationFilter').empty();
};

function clearDepartmentFilter() {
    $('#deptFilter').empty();
};

function clearDepartments() {
    $('.deptOptions').empty();
};


function getAllDepartments () {
    $.ajax({
        type: "GET",
        url: "libs/php/getAllDepartments.php",
        dataType: "json",
       
        success: function(data) {
            
            console.log(data);

            //options for select dropdown
            let departments = $('.deptOptions');
            data.forEach(function(option){
                $('<option>').text(option.name).val(option.id).appendTo(departments); //does this intefer with adding new record?
            });

              //options for dept filter
            
            $.each(data, function(index, option) {
                var checkbox = $('<label class="list-group-item"><input class="form-check-input me-1" type="checkbox" value="' + option.name + '" checked>'+ option.name +'</label>');
                checkbox.data('id', option.id);
                
                $('#deptFilter').append(checkbox);
                selectedDeptValues.push(option.id);
              });
        }
    });
};

function getAllLocations () {
    $.ajax({
        type: "GET",
        url: "libs/php/getAllLocations.php",
        dataType: "json",
       
        success: function(data) {
            
            console.log(data);

            //options for select dropdown
            let locations = $('.locationOptions');
            data.forEach(function(option){
                $('<option>').text(option.name).val(option.id).appendTo(locations);
            });
            
            //options for dept filter
                        
            $.each(data, function(index, option) {
                var checkbox = $('<label class="list-group-item"><input class="form-check-input me-1" type="checkbox" value="' + option.name + '" checked>'+ option.name +'</label>');
                checkbox.data('id', option.id);
                
                $('#locationFilter').append(checkbox);
                selectedLocationValues.push(option.id);
            });
        }
    });
};

//Reset modals when the 'close' button is clicked to return the forms to a blank state if opened again
let closeButton = document.querySelectorAll('.closeModal');
closeButton.forEach(function(button) {
    button.addEventListener('click', function() {
      newPersonnelForm.reset();
      addNewLocationForm.reset();
      deleteLocationForm.reset();
      addNewLocationForm.reset();
      addNewDepartmentForm.reset();
    });
  });

////filtering

//add selected department checkboxes to an array to pass into ajax request
$(document).on('change', '#deptFilter input[type=checkbox]', function(){
    selectedDeptValues = [];
    $('#deptFilter input[type=checkbox]:checked').each(function() {
        selectedDeptValues.push($(this).closest('label').data('id'));
    });
    console.log(selectedDeptValues);
    filterRecords();
});


//add selected location checkboxes to an array to pass into ajax request
$(document).on('change', '#locationFilter input[type=checkbox]', function(){
    selectedLocationValues = [];
    $('#locationFilter input[type=checkbox]:checked').each(function() {
        selectedLocationValues.push($(this).closest('label').data('id'));
    });
    console.log(selectedLocationValues);
    filterRecords();
});


function filterRecords(){
    clearTableRows();
    let postData = {
        array1: selectedDeptValues,
        array2: selectedLocationValues
    };
    
    $.ajax({
        type: "GET",
        url: "libs/php/newFilter.php",
        dataType: "json",
        data: postData,
       
        success: function(data) {

            console.log(data);
            
            $.each(data.data, function(key, value) {
                $("#records").append("<tr data-row-id='" + value.id + "'class='employee'><td>" + value.lastFirst + "</td><td class='d-sm-none d-none d-md-table-cell'>" + value.jobTitle + "</td><td data-dept='" + value.deptID + "' class='d-sm-none d-none d-md-table-cell'>" + value.department + "</td><td class='d-sm-none d-none d-md-table-cell'>" + value.email + "</td><td class='d-sm-none d-none d-lg-table-cell'>" + value.location + "</td><td><button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#editRecordModal' class='btn btn-primary editRecModalBtn'><i class='fa fa-user-pen fa-xs'></i></button></td><td> <button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#deleteRecordModal' class='btn btn-danger delRecModalBtn'><i class='fa fa-trash fa-xs'></i></button></td></tr>");
                });

                    //functionality for record deletion
                    const delButtons = document.querySelectorAll('.delRecModalBtn');                    
                    delButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const rowId = button.dataset.rowId;
                        console.log(rowId);
                        let firstNameData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(1)`);
                        let lastNameData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(2)`);
                        let jobTitleData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(3)`);
                        let deptData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(4)`);
                        let emailData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(5)`);
                        document.getElementById('idDel').value = rowId;
                        document.getElementById('firstNameDel').value = firstNameData.innerHTML;
                        document.getElementById('lastNameDel').value = lastNameData.innerHTML;
                        document.getElementById('jobTitleDel').value = jobTitleData.innerHTML;
                        document.getElementById('emailDel').value = emailData.innerHTML;
                        document.getElementById('deptDel').value = deptData.innerHTML;
                    });
                    });
    
                    //functionality for record edit
                    const editButtons = document.querySelectorAll('.editRecModalBtn');                    
                    editButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const rowId = button.dataset.rowId;
                        console.log(rowId);
                        let editFirstNameData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(1)`);
                        let editLastNameData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(2)`);
                        let editJobTitleData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(3)`);
                        let editDeptData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(4)`);
                        let editEmailData = document.querySelector(`#records tr[data-row-id="${rowId}"] td:nth-child(5)`);
                        console.log(editDeptData.innerHTML);
                        document.getElementById('idEdit').value = rowId;
                        document.getElementById('firstNameEdit').value = editFirstNameData.innerHTML;
                        document.getElementById('lastNameEdit').value = editLastNameData.innerHTML;
                        document.getElementById('jobTitleEdit').value = editJobTitleData.innerHTML;
                        document.getElementById('emailEdit').value = editEmailData.innerHTML;
                        let deptCode = editDeptData.getAttribute("data-dept");
                        let deptSelect = document.getElementById('deptEdit');
                        for (let i = 0; i < deptSelect.options.length; i++) {
                        if (deptSelect.options[i].value === deptCode) {
                            deptSelect.options[i].selected = true;
                            break;
                        }
                        }
                    });
                    });
        }
    });
};


//event listeners for form submissions with custom confirm message
deletePersonnelRecordForm.addEventListener('submit', function(event){
    event.preventDefault();
    deletePersonnelRecord();
});


editPersonnelRecordForm.addEventListener('submit', function(event){
    event.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure you want to edit this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            editPersonnelRecord();
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Request cancelled',
            'Record not updated',
            'info'
          )
        }
      })
});


deleteLocationForm.addEventListener('submit', function(event){
    event.preventDefault();
    deleteLocation();
});


deleteDepartmentForm.addEventListener('submit', function(event){
    event.preventDefault();
    deleteDepartment();
});


newPersonnelForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure you want to create this new record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            createNewPersonnelRecord();
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Request cancelled',
            'Personnel record not created',
            'info'
          )
        }
      })
});


addNewLocationForm.addEventListener('submit', function(event){
    event.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure you want to create this Location?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            addNewLocation();
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Request cancelled',
            'Location not created',
            'info'
          )
        }
      })

});


addNewDepartmentForm.addEventListener('submit', function(event){
    event.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure you want to create this Department?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            addNewDepartment();
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Add request cancelled',
            'Department not created',
            'info'
          )
        }
      })

});


editDepartmentForm.addEventListener('submit', function(event){
    event.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure you want to edit this Department?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            editDepartment();
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Edit request cancelled',
            'Department not edited',
            'info'
          )
        }
      })
});

editLocationForm.addEventListener('submit', function(event){
    event.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure you want to edit this Location?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            editLocation();
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Edit request cancelled',
            'Location not edited',
            'info'
          )
        }
      })
});


//Custom alerts after form submission
function customLocationAlert (code, description) {
    
    if(code == 200){
        Swal.fire(
            'Success',
            description,
            'success'
          )
    } else if (code == 400){
        Swal.fire(
            'Error!',
            description,
            'error'
          )
    } else if (code == 300){
        Swal.fire(
            'Error!',
            description,
            'error'
          )
    }
};

function customDepartmentAlert (code, description) {
    
    if(code == 200){
        Swal.fire(
            'Success',
            description,
            'success'
          )
    } else if (code == 400){
        Swal.fire(
            'Error!',
            description,
            'error'
          )
    } else if (code == 300){
        Swal.fire(
            'Error!',
            description,
            'error'
          )
    }
};

function customPersonnelAlert (code, description) {

    if(code == 200){
        Swal.fire(
            'Success',
            description,
            'success'
          )
    } else if (code == 400){
        Swal.fire(
            'Error!',
            description,
            'error'
          )
    } else if (code == 300){
        Swal.fire(
            'Error!',
            description,
            'error'
          )
    }
};


//get active nav link

let addNewTab = document.getElementById('nav-addNew-tab');

addNewTab.addEventListener('click', function(){
    let activeTab = document.querySelector('#stickyTabs .nav-link.active').innerText;
    if(activeTab == 'Personnel'){
        console.log('personnel tab');
        newPersonnelModal.show();
    } else if (activeTab == 'Department'){
        console.log('department tab');
        departmentModal.show();
    } else {
        console.log('location tab');
        locationModal.show();
    }
})