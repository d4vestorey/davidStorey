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
    getDepartmentsAndLocations();
});


selectedDeptValues = [];
selectedLocationValues = [];


function populateTable () {
    $.ajax({
        type: "POST",
        url: "libs/php/getAll.php",
        dataType: "json",
        success: function(data) {
            $.each(data.data, function(key, value) {
                $("#records").append("<tr data-row-id='" + value.id + "'class='employee'><td>" + value.firstName + "</td><td>" + value.lastName + "</td><td>" + value.jobTitle + "</td><td data-dept='" + value.deptID + "'>" + value.department + "</td><td>" + value.email + "</td><td>" + value.location + "</td><td><button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#editRecordModal' class='btn btn-primary editRecModalBtn'><i class='fa fa-user-pen fa-xs'></i></button></td><td> <button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#deleteRecordModal' class='btn btn-danger delRecModalBtn'><i class='fa fa-trash fa-xs'></i></button></td></tr>");
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
}

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

   //add in txtValues to for loop below::

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
})



function clearTableRows() {
    $('#records tbody').empty();
}

//create new personnel record
const newPersonnelForm = document.getElementById('employeeRecordForm');
const newPersonnelModal = new bootstrap.Modal(document.querySelector('#staticBackdrop'));


function createNewPersonnelRecord(){
    $.ajax({
        type: "POST",
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

            console.log(data);
            
            alert(
            `Record created with the following data:
            First Name: ${data.data[0]}
            Last Name: ${data.data[1]}
            Job Title: ${data.data[2]}
            email: ${data.data[3]}
            Department: ${data.data[4]}`);

            newPersonnelModal.hide();
            newPersonnelForm.reset();
            populateTable();
        }
    });
};



//delete personnel record
const deletePersonnelRecordForm = document.getElementById('deletePersonnelRecordForm');
const deletePersonnelRecordModal = new bootstrap.Modal(document.querySelector('#deleteRecordModal'));

//new delete personnel which is called with confirm message
function deletePersonnelRecord() {
    // code to delete record goes here
    $.ajax({
        type: "POST",
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

            console.log(data);
            
            alert(
            `The following record was successfully deleted:
            Personnel ID: ${data.data[0]}
            First Name: ${data.data[1]}
            Last Name: ${data.data[2]}
            Job Title: ${data.data[3]}
            Department: ${data.data[4]}
            `
            );
            
            let rowToDelete = document.querySelector(`#records tr[data-row-id="${data.data[0]}"]`);
            rowToDelete.remove();
            deletePersonnelRecordModal.hide();
        }
    });
}


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
            
            alert(
            `The following record was updated:
            First Name: From: ${data.prevData.firstName} To: ${data.newData[0]}
            Last Name: From: ${data.prevData.lastName} To: ${data.newData[1]}
            Job Title: From: ${data.prevData.jobTitle} To: ${data.newData[2]}
            email: From: ${data.prevData.email} To: ${data.newData[3]}
            Department: From: ${data.prevData.department} To: ${data.newData[4]}
            `
            );
            
            clearTableRows();
            populateTable();
            editPersonnelRecordModal.hide();
        }
    });
}

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

            console.log(data);
            
            alert(
            data.status.description
            );
            
            clearTableRows();
            populateTable();
            locationModal.hide();
            addNewLocationForm.reset();
        }
    });
};

//delete location
const deleteLocationForm = document.getElementById('deleteLocationForm');

function deleteLocation(){
    $.ajax({
        type: "POST",
        url: "libs/php/deleteLocation.php",
        dataType: "json",
        data:{
            locationID: $("#delLocationInput").val(),
            name: $("#delLocationInput option:selected").text(),
        },
        success: function(data) {

            console.log(data);
            
            alert(
            data.status.description
            );
            
            clearTableRows();
            populateTable();
            locationModal.hide();
            deleteLocationForm.reset();
        }
    });
}

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
            
            alert(
            data.status.description
            );
            
            clearTableRows();
            populateTable();
            departmentModal.hide();
            addNewDepartmentForm.reset();
        }
    });
};


//delete department
const deleteDepartmentForm = document.getElementById('deleteDepartmentForm');

function deleteDepartment(){
    $.ajax({
        type: "POST",
        url: "libs/php/deleteDepartment.php",
        dataType: "json",
        data:{
            locationID: $("#delDepartmentInput option:selected").data('location'),
            deptAndLocationName: $("#delDepartmentInput option:selected").text(),
            deptID: $("#delDepartmentInput option:selected").val(),
        },
        success: function(data) {

            console.log(data);
            
            alert(
            data.status.description
            );
            
            clearTableRows();
            populateTable();
            departmentModal.hide();
            deleteDepartmentForm.reset();
        }
    });
};


function getAllDepartments () {
    $.ajax({
        type: "POST",
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
                var checkbox = $('<input type="checkbox" value="' + option.name + '" checked>');
                checkbox.data('id', option.id);
                var label = $('<label>').append(checkbox).append(option.name);
            
                $('#deptFilter').append(label);
                selectedDeptValues.push(option.id);
              });
        }
    });
}

function getAllLocations () {
    $.ajax({
        type: "POST",
        url: "libs/php/getAllLocations.php",
        dataType: "json",
       
        success: function(data) {
            
            console.log(data);

            //options for select dropdown
            let locations = $('.locationOptions');
            data.forEach(function(option){
                $('<option>').text(option.name).val(option.id).appendTo(locations);
            });

            //options for location filter
            $.each(data, function(index, option) {
                var checkbox = $('<input type="checkbox" value="' + option.name + '" checked>');
                checkbox.data('id', option.id);
                var label = $('<label>').append(checkbox).append(option.name);
            
                $('#locationFilter').append(label);
                selectedLocationValues.push(option.id);
              });

        }
    });
}

function getDepartmentsAndLocations () {
    $.ajax({
        type: "POST",
        url: "libs/php/getLocationsAndDepartments.php",
        dataType: "json",
       
        success: function(data) {
            
            console.log(data);
            
            let locationAndDepts = document.getElementById('delDepartmentInput');
            data.forEach(({deptID, deptName, locationID, locationName}) => {
                const option = document.createElement("option");
                option.text = `${deptName} - ${locationName}`;
                option.value = deptID;
                option.setAttribute("data-location", locationID);
                locationAndDepts.add(option);
              });

        }
    });
}

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


//add selected checkboxes to an array to pass into ajax request
$(document).on('change', '#deptFilter input[type=checkbox]', function(){
    selectedDeptValues = [];
    $('#deptFilter input[type=checkbox]:checked').each(function() {
        selectedDeptValues.push($(this).data('id'));
    });
    console.log(selectedDeptValues);
    filterRecords();
});


//add selected checkboxes to an array to pass into ajax request
$(document).on('change', '#locationFilter input[type=checkbox]', function(){
    selectedLocationValues = [];
    $('#locationFilter input[type=checkbox]:checked').each(function() {
        selectedLocationValues.push($(this).data('id'));
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
        type: "POST",
        url: "libs/php/newFilter.php",
        dataType: "json",
        data: postData,
       
        success: function(data) {
            
            $.each(data.data, function(key, value) {
                $("#records").append("<tr data-row-id='" + value.id + "'class='employee'><td>" + value.firstName + "</td><td>" + value.lastName + "</td><td>" + value.jobTitle + "</td><td data-dept='" + value.deptID + "'>" + value.department + "</td><td>" + value.email + "</td><td>" + value.location + "</td><td><button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#editRecordModal' class='btn btn-primary editRecModalBtn'><i class='fa fa-user-pen fa-xs'></i></button></td><td> <button data-row-id='" + value.id + "' data-bs-toggle='modal' data-bs-target='#deleteRecordModal' class='btn btn-danger delRecModalBtn'><i class='fa fa-trash fa-xs'></i></button></td></tr>");
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

}


deletePersonnelRecordForm.addEventListener('submit', function(event){
    event.preventDefault();

    if (confirm("Are you sure you want to delete this record?")) {
        // User clicked OK, perform deletion
        deletePersonnelRecord();
    } else {
        // User clicked Cancel, do nothing
    }
});


editPersonnelRecordForm.addEventListener('submit', function(event){
    event.preventDefault();
    if (confirm("Are you sure you want to edit this record?")) {
        // User clicked OK, perform deletion
        editPersonnelRecord();
    } else {
        // User clicked Cancel, do nothing
    }
});


deleteLocationForm.addEventListener('submit', function(event){
    event.preventDefault();
    if (confirm("Are you sure you want to delete this record?")) {
        // User clicked OK, perform deletion
        deleteLocation();
    } else {
        // User clicked Cancel, do nothing
    }
});


deleteDepartmentForm.addEventListener('submit', function(event){
    event.preventDefault();
    if (confirm("Are you sure you want to delete this record?")) {
        // User clicked OK, perform deletion
        deleteDepartment();
    } else {
        // User clicked Cancel, do nothing
    }
});


newPersonnelForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to create this new record?")) {
        // User clicked OK, perform deletion
        createNewPersonnelRecord();
    } else {
        // User clicked Cancel, do nothing
    }
});


addNewLocationForm.addEventListener('submit', function(event){
    event.preventDefault();
    if (confirm("Are you sure you want to create this new location?")) {
        // User clicked OK, perform deletion
        addNewLocation();
    } else {
        // User clicked Cancel, do nothing
    }
});

addNewDepartmentForm.addEventListener('submit', function(event){
    event.preventDefault();
    if (confirm("Are you sure you want to create this new department?")) {
        // User clicked OK, perform deletion
        addNewDepartment();
    } else {
        // User clicked Cancel, do nothing
    }
});

/* this works but without confirm

deletePersonnelRecordForm.addEventListener('submit', function(event){
    event.preventDefault();

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

            console.log(data);
            
            alert(
            `The following record was successfully deleted:
            Personnel ID: ${data.data[0]}
            First Name: ${data.data[1]}
            Last Name: ${data.data[2]}
            Job Title: ${data.data[3]}
            Department: ${data.data[4]}
            `
            );
            
            let rowToDelete = document.querySelector(`#records tr[data-row-id="${data.data[0]}"]`);
            rowToDelete.remove();
            deletePersonnelRecordModal.hide();
        }
    });
})

*/


/*this works but without confirm

editPersonnelRecordForm.addEventListener('submit', function(event){
    event.preventDefault();

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
            
            alert(
            `The following record was updated:
            First Name: From: ${data.prevData.firstName} To: ${data.newData[0]}
            Last Name: From: ${data.prevData.lastName} To: ${data.newData[1]}
            Job Title: From: ${data.prevData.jobTitle} To: ${data.newData[2]}
            email: From: ${data.prevData.email} To: ${data.newData[3]}
            Department: From: ${data.prevData.department} To: ${data.newData[4]}
            `
            );
            
            clearTableRows();
            populateTable();
            editPersonnelRecordModal.hide();
            
        }
    });
})

*/



/*
this works but without confirm

deleteLocationForm.addEventListener('submit', function(event){
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "libs/php/deleteLocation.php",
        dataType: "json",
        data:{
            locationID: $("#delLocationInput").val(),
            name: $("#delLocationInput option:selected").text(),
        },
        success: function(data) {

            console.log(data);
            
            alert(
            data.status.description
            );
            
            clearTableRows();
            populateTable();
            locationModal.hide();
            deleteLocationForm.reset();
        }
    });
})
*/

/*this works but without confirm
deleteDepartmentForm.addEventListener('submit', function(event){
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "libs/php/deleteDepartment.php",
        dataType: "json",
        data:{
            locationID: $("#delDepartmentInput option:selected").data('location'),
            deptAndLocationName: $("#delDepartmentInput option:selected").text(),
            deptID: $("#delDepartmentInput option:selected").val(),
        },
        success: function(data) {

            console.log(data);
            
            alert(
            data.status.description
            );
            
            clearTableRows();
            populateTable();
            departmentModal.hide();
            deleteDepartmentForm.reset();
        }
    });
});
*/


/*this works but without confirm
newPersonnelForm.addEventListener('submit', function(event) {
    event.preventDefault();
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

            console.log(data);
            
            alert(
            `Record created with the following data:
            First Name: ${data.data[0]}
            Last Name: ${data.data[1]}
            Job Title: ${data.data[2]}
            email: ${data.data[3]}
            Department: ${data.data[4]}`);

            newPersonnelModal.hide();
            newPersonnelForm.reset();
        }
    });

});
*/

/*
addNewLocationForm.addEventListener('submit', function(event){
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "libs/php/insertLocation.php",
        dataType: "json",
        data:{
            location: $("#newLocationInput").val(),
        },
        success: function(data) {

            console.log(data);
            
            alert(
            data.status.description
            );
            
            clearTableRows();
            populateTable();
            locationModal.hide();
            addNewLocationForm.reset();
        }
    });
});
*/

/*
addNewDepartmentForm.addEventListener('submit', function(event){
    event.preventDefault();

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
            
            alert(
            data.status.description
            );
            
            clearTableRows();
            populateTable();
            departmentModal.hide();
            addNewDepartmentForm.reset();
        }
    });
});
*/