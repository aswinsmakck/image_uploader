window.addEventListener('DOMContentLoaded', function(evt){
    
    const btnToShowModal = document.querySelector(".btn-upload");
    const modalWindow = document.querySelector(".modal-window");
    const closeButton = document.querySelector(".close-button");
    const fileInputField = document.querySelector("#filesupld");


    const lblFileUpload = document.querySelector(".lbl_upload"); 

    const formToUpload = document.querySelector(".file-upload-form");

    function showThumbnails(){
        console.log(lblFileUpload);
        let filesArr = Object.values(fileInputField.files);

        if(filesArr.length == 0) return;
        lblFileUpload.innerHTML = "";
        filesArr.forEach(file => {
            const div = document.createElement('div');
            const img = document.createElement('img');
            //div.appendChild(img);
            div.classList.add('thumbnail');
            img.classList.add('thumbnail-image');

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                //img.src = reader.result;
                div.style.backgroundImage = `url(${reader.result})`;
            }
            lblFileUpload.appendChild(div);
        })

    }

    btnToShowModal.addEventListener('click', function(evt){
        location.href = "showModal"
        //modalWindow.classList.add('modal-window-active')
    });

    fileInputField.addEventListener('change', showThumbnails)

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
        //lblFileUpload.classList.remove('upload-started');
        console.log(evt)
        const files = evt.dataTransfer.files;
        
        fileInputField.files = files
        

        showThumbnails();
    });
});