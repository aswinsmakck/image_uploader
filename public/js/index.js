window.addEventListener('DOMContentLoaded', function(evt){
    
    const btnToShowModal = document.querySelector(".btn-upload");
    const modalWindow = document.querySelector(".modal-window");
    const closeButton = document.querySelector(".close-button");

    const lblFileUpload = document.querySelector(".lbl_upload"); 

    const formToUpload = document.querySelector(".file-upload-form");

    btnToShowModal.addEventListener('click', function(evt){
        location.href = "showModal"
        //modalWindow.classList.add('modal-window-active')
    });

    formToUpload.addEventListener('submit', function(evt){
        try{
            let preventUpload = true;
            let violatedFiles = { nonAcceptedFormatFound : false, message : "File Format should be either Jpeg | jpg | png"};

            let files = document.getElementById('filesupld').files
            let filesArr = Object.values(files);
            filesArr.forEach(file => {
                if(!(file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type ==='image/png' )){
                    violatedFiles.nonAcceptedFormatFound = true;
                    violatedFiles.message += "\n" + file.name;
                }
            });


            if(violatedFiles.nonAcceptedFormatFound){
                alert(violatedFiles.message);
                
            }
            else if(filesArr.length > 0){
                preventUpload = false;
            }
            else{
                alert('upload any file')
            }
            if(preventUpload){
                evt.preventDefault();
            }
        }
        catch(ex){
            evt.preventDefault();
        }
    })

    closeButton.addEventListener('click', function(evt){
        console.log(location);
        location.href = location.origin;
    });

    lblFileUpload.addEventListener('dragover',function(evt){
        evt.preventDefault();
    });

    lblFileUpload.addEventListener('dragenter',function(evt){
        lblFileUpload.classList.add('upload-started');
    });

    lblFileUpload.addEventListener('dragleave',function(evt){
        lblFileUpload.classList.remove('upload-started');
    });

    lblFileUpload.addEventListener('drop',function(evt){
        evt.preventDefault();
        //evt.stopPropagation();
        lblFileUpload.classList.remove('upload-started');
        const files = evt.dataTransfer.files;
        
        document.getElementById('filesupld').files = files;

        console.log(lblFileUpload);
        console.log(files);
    });
});