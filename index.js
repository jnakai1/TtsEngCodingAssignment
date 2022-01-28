window.onload = function(){
    /*
    -Validate data entry (age is required and > 0, relationship is required)
    -Add people to a growing household list
    -Reset the entry form after each addition
    -Remove a previously added person from the list
    -Display the household list in the HTML as it is modified
    -Serialize the household as JSON upon form submission as a fake trip to the server
    -Follow industry accessibility guidelines for form validation
    */
        // SCOPE VARs
        var MEMBER_LIST = [];
        var FORM_MEMBER = document.querySelector("form");
        var INPUT_AGE = document.querySelector("#age");
        var INPUT_REL = document.querySelector("#rel");
        var INPUT_SMOKER = document.querySelector("#smoker");
        var ORDERED_LIST = document.querySelector("ol");
        var BUTTON_ADD = document.querySelector(".add");
        var DEBUG = document.querySelector(".debug");
        var MESSAGE_AREA; // Set on creation
    
        // Init Page
        function initPage(){
            //console.log("initPage [TEST] ---");
            // Add event listeners
            BUTTON_ADD.addEventListener("click", function(e){ onAdd(e); });
            FORM_MEMBER.addEventListener("submit", function(e){ onSubmit(e); });
    
            // Update UI
            // Create message area
            MESSAGE_AREA = document.createElement("p");
            // Set attributes
            FORM_MEMBER.noValidate= true;
            MESSAGE_AREA.setAttribute("aria-live","assertive");
            ORDERED_LIST.setAttribute("aria-live","polite");
            INPUT_AGE.required = true;
            INPUT_AGE.setAttribute("type","number");
            INPUT_REL.required = true;
    
            // Add message area
            FORM_MEMBER.insertBefore(MESSAGE_AREA, FORM_MEMBER.firstElementChild);
    
            // Add required/optional hints
            addHintBefore(INPUT_AGE, "(required)");
            addHintBefore(INPUT_REL, "(required)");
            addHintBefore(INPUT_SMOKER, "(optional)");
    
            function addHintBefore(target, hintText){
                var inputParent = target.parentElement;
                var textholder = document.createTextNode(hintText);
                inputParent.insertBefore(textholder,target);
            }
            return true;
        }
    
        // onAdd
        function onAdd(e){
            //console.log("onAdd [TEST] ---");
            // Prevent default behavior
            e.preventDefault();
            // Reset member 
            clearFormMessages();//clearMessage(MESSAGE_AREA);
            clearFormErrors();
            // Get form data
            var formData = getFormData(FORM_MEMBER);
            // Get form errors
            var errorList = getErrors(formData);
            //console.log(errorList);
            // Check for errors
            // if errors
            if(errorList.length > 0){
                // Output errors
                outputErrors(MESSAGE_AREA, errorList);
                // Return false
                return false;
            }
            // else
            else{
                //console.log("no errors!!");
                // Add new member to member list
                addNewMember(formData);
                //console.log(MEMBER_LIST);
                // Output list
                outputList(ORDERED_LIST, MEMBER_LIST);
                // Rest form
                FORM_MEMBER.reset();
    
                return true;
            }
        }
            // Get form data
            function getFormData(mForm){
                //console.log("getFormData [TEST] ---");
                // get form data
                var myData = Object.fromEntries(new FormData(mForm).entries());
                // Return data object
                return myData;
            }
            // get form errors
            function getErrors(fData){
                //console.log("getFormErrors [TEST] ---");
                var returnList = [];
                var regex = /^[0-9]+$/;
                // Check input values
                if(!fData.age.match(regex)){
                    var ageError = {
                        inputName : "age",
                        errorMessage : "Age is required and must be greater than 0."
                    };
                    // Add to error list
                    returnList.push(ageError);
                }
                if(!fData.rel){
                    var relError = {
                        inputName : "rel",
                        errorMessage : "Relationship is required."
                    };
                    // Add to error list
                    returnList.push(relError);
                }
                return returnList;
            }
            // Output errors
            function outputErrors(target, eList){
                //console.log("outputErrors [TEST] ---");
                // BUild bucket error message
                var bucketMessage = "A form submission error has ocurred. Please address these errors and resubmit the form:";
                // Create list element
                var ul = document.createElement("ul");
                // Clear message area
                //clearMessage(target);
                // Loop through error list
                for(var i=0; i < eList.length; i++){
                    // Create li
                    var li = document.createElement("li");
                    // Create anchor and text
                    var anchor = document.createElement("a");
                    var anchorText = document.createTextNode(eList[i].errorMessage);
                    // Update anchor
                    anchor.setAttribute("href","#"+eList[i].inputName);
                    anchor.appendChild(anchorText);
                    // add anchor to li
                    li.appendChild(anchor);
                    // add li to ul
                    ul.appendChild(li);
                }
                // Add bucket message to target
                target.appendChild(document.createTextNode(bucketMessage));
                // Add UL to target
                target.appendChild(ul);
                
                // Set form errors
                setFormErrors(eList);
            }
            // Set form errors
            function setFormErrors(eList){
                //console.log("outputErrors [NEED] ---");
                //console.log("eList: "+JSON.stringify(eList,null,2));
                // Loop through errors and set states
                for(var i = 0; i < eList.length; i++){
                    var eInputName = eList[i].inputName;
                    var eInput = document.getElementById(eInputName);
                    var eInputParent = eInput.parentElement;
                    var eErrorHint = eList[i].errorMessage;
                    // CHeck if already in error state
                    if(!hasClass(eInputParent, "error")){
                        // Create hint containters
                        //console.log("no error class");
                        var hintContainer = document.createElement("span");
                        var hintSpanId = eInputName+"Hint";
                        // Set attrs
                        eInputParent.setAttribute("class","error");
                        eInput.setAttribute("aria-live","true");
                        eInput.setAttribute("aria-describedby", hintSpanId);
                        hintContainer.setAttribute("id",hintSpanId);
                        hintContainer.setAttribute("class","errorHint");
                        // Add hint to span
                        hintContainer.appendChild(document.createTextNode(eErrorHint));
                        // Add span to input parent
                        eInputParent.append(hintContainer);
                    }
                }
            }
            // hasClass 
            function hasClass(el, className){
                // use regex from experience
                var regex = "(\\s|^)" + className + "(\\s|$)";
                return el.className.match(regex)? true : false;
            }
            // Add new member to member list
            function addNewMember(mInfo){
                //console.log("addNewMember [TEST] ---");
                // New member object
                MEMBER_LIST.push(mInfo);
            }
        
    
        // onSubmit
        function onSubmit(e){
            //console.log("onSubmit [TEST] ---");
            e.preventDefault();
            // Serialize the household as JSON upon form submission as a fake trip to the server
            // get serialized JSON
            var serJson = JSON.stringify(MEMBER_LIST, null, 2);
            // Update element
            DEBUG.innerHTML = serJson;
            // Show element
            DEBUG.style.display = "block";
        }
    
        // deleteMember
        function deleteMember(e){
            //console.log("deleteMember [TEST] ---");
            // check target
            if(e.target.id){
                // Get id number from string
                var regex = /(\d+)/;
                var idNumber = Number(e.target.id.match(regex));
                // COnfirm and delete
                if(window.confirm("Do you want to delete this member from the list?")){
                    MEMBER_LIST.splice(idNumber,1);
                    outputList(ORDERED_LIST, MEMBER_LIST);
                }else{
                    return false;
                }
            }
        }
    
        // Utilities
        // Output List: requires pre-clearing of target element
        function outputList(target, mList){
            //console.log("outputList [TEST] ---");
            // CLear target
            clearOrderedList(target);
            for(var i=0; i, i < mList.length; i++){
                //console.log(mList.length);
                // Build li text
                var relText = "Relationship: " + mList[i].rel;
                var ageText = "Relationship: " + mList[i].age;
                var smokingStatus = (mList[i].smoker) ? "yes" : "";
                var smokerText = "Smoker?: " + smokingStatus;
                var liText = relText + ", " + ageText + ", " + smokerText;
    
                // Create li
                var li = document.createElement("li");
                // Create delete button
                var deleteButton = document.createElement("button");
                // Configure button
                deleteButton.innerHTML="Delete Member";
                deleteButton.setAttribute("id", "memberId_"+i);
                deleteButton.addEventListener("click",deleteMember);
                // add to li
                li.appendChild(document.createTextNode(liText));
                li.appendChild(deleteButton);
                // add to ol
                target.appendChild(li);
            }
        }
        // Clear message area
        function clearOrderedList(target){
            // Clear ordered list
            if(target.childNodes.length > 0){
                while(target.firstChild){
                    target.removeChild(target.firstChild);
                }
            }
        }
        
        // Reset  form
        function clearFormMessages(){
            //console.log("clearFormMessages [TEST] ---");
            // Clear message area
            if(MESSAGE_AREA.childNodes.length > 0){
                while(MESSAGE_AREA.firstChild){
                    MESSAGE_AREA.removeChild(MESSAGE_AREA.firstChild);
                }
            }
        }
    
        // clear form errors
        function clearFormErrors(){
            //console.log("clearFormErrors [TEST] ---");
            // remove all hints
            var hints = document.getElementsByClassName("errorHint");
            // Check if hints
            if(hints.length>0){
                while(hints.length>0){
                    hints[0].parentNode.removeChild(hints[0]);
                }
            }
            // reset input age
            INPUT_AGE.removeAttribute("aria-invalid");
            INPUT_AGE.removeAttribute("aria-describedby");
            INPUT_AGE.parentElement.removeAttribute("class");
            // reset input rel
            INPUT_REL.removeAttribute("aria-invalid");
            INPUT_REL.removeAttribute("aria-describedby");
            INPUT_REL.parentElement.removeAttribute("class");
        }
    
        return initPage();
    };