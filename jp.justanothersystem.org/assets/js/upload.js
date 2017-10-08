import '../sass/main.scss'

const bucketName = 'julias-panel-east.justanothersystem.org'
const bucketRegion = 'us-east-1'
const identityPoolId = 'us-east-1:ba33bec9-8d61-4eea-9353-8fbfd5b9f3bb'

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

document.getElementById('upload').onclick = () => {
  const files = document.getElementById('file').files

  if (!files.length) {
    return window.alert('Please choose a file to upload first.')
  }

  const file = files[0]
  const fileName = file.name
  const photoKey = `${new Date().toISOString()}_${fileName}`

  s3.upload({
    Key: photoKey,
    Body: file,
    ACL: 'public-read' // TODO: Is this necessary?
  }, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      progressClear('rgb(0, 255, 0)')
    }
  }).on('httpUploadProgress', (evt) => {
    progressRender(evt.loaded / evt.total)
  })
}

// Progress bar

const can = document.getElementById('progress')
const ctx = can.getContext('2d')
can.width = 100
can.height = 10

function progressClear (color) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, can.width, can.height)
}

function progressRender (p) {
  ctx.fillStyle = `rgb(0, ${Math.round(p * 255)}, 0)`
  ctx.fillRect(0, 0, Math.round(p * can.width), can.height)
}

progressClear('rgb(0, 0, 0)')
