import '../sass/main.scss'

// Setting up Amazon Web Services

const bucketName = 'julias-panel-east.justanothersystem.org'
const bucketRegion = 'us-east-1'
const identityPoolId = 'us-east-1:4c130e96-cf5d-4eff-898d-283c119b14f6'

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
  })
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucketName}
})

let listTimeout

function list () {
  console.log('Searching for images...')
  clearTimeout(listTimeout)
  s3.listObjects({
    Bucket: bucketName,
    MaxKeys: 1
  }, (err, data) => {
    if (err) {
      console.error(err)
    } else {
      console.log(data)

      if (data.Contents.length > 0) {
        const key = data.Contents[0].Key
        const url = `https://justanothersystem.imgix.net/${key}?w=2048&fit=max&auto=compress`
        addImage(url, key)
        console.log('Image found!', key)
      } else {
        console.log('No images found :(')
        listTimeout = setTimeout(() => {
          list()
        }, 5000)
      }
    }
  })
}

list()

function removeImage (el) {
  el.classList.add('active')

  s3.deleteObject({
    Bucket: bucketName,
    Key: el.dataset.key
  }, function (err, data) {
    if (err) {
      console.log(err, err.stack)
      e.target.classList.remove('active')
      // TODO: Show the user that the deletion failed.
    } else {
      console.log(data)
      // Remove the image from the page.
      el.remove()
      console.log('Removed image.')
      window.onkeydown = undefined
      list()
    }
  })
}

function addImage (url, key) {
  const img = new window.Image()
  img.src = url
  img.id = 'image'
  img.dataset.key = key
  document.body.appendChild(img)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') { removeImage(img) }
  });
}

window.addEventListener('keydown', (e) => {
  if(e.key === ' ') { list() }
});

window.onfocus = function (e) {
  document.body.classList.remove('inactive')
  list()
}

window.onblur = function (e) {
  document.body.classList.add('inactive')
}
