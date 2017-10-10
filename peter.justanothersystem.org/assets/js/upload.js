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

const fileInput = document.getElementById('file')

fileInput.onchange = () => {
  const files = document.getElementById('file').files

  if (!files.length) {
    return window.alert('Please choose a file to upload first.')
  }

  fileInput.classList.add('inactive') // Disable file input.

  const file = files[0]

  // Set up progress bar
  progressPattern = undefined

  // Make progress pattern
  window.createImageBitmap(file).then(makeProgressPattern)

  // Start upload
  const fileName = file.name
  const photoKey = `${new Date().toISOString()}_${fileName}`

  s3.upload({
    Key: photoKey,
    Body: file,
    ACL: 'public-read' // TODO: Is this necessary?
  }, function (err, data) {
    if (err) {
      console.log('Error', err)
    }
    progressClear()
    fileInput.classList.remove('inactive') // Re-enable file input.
  }).on('httpUploadProgress', (evt) => {
    progressRender(evt.loaded / evt.total)
  })
}

// Image preview progress bar

const progressCan = document.createElement('canvas')
const progressCanCtx = progressCan.getContext('2d')

function makeProgressPattern (imageBitmap) {
  // Proportionally resize canvas to 2048 max.
  const maxSize = 2048
  if (imageBitmap.width > maxSize || imageBitmap.height > maxSize) {

    // Get longest side.

    // If width is longest side.
    if (imageBitmap.width > imageBitmap.height) {
      can.width = maxSize
      can.height = Math.round((imageBitmap.height / imageBitmap.width) * maxSize)
    } else { // If height is longest side.
      can.height = maxSize
      can.width = Math.round((imageBitmap.width / imageBitmap.height) * maxSize)
    }
  } else {
    can.width = imageBitmap.width
    can.height = imageBitmap.height
  }

  progressCan.width = can.width
  progressCan.height = can.height
  progressCanCtx.drawImage(imageBitmap, 0, 0, progressCan.width, progressCan.height)
  progressPattern = ctx.createPattern(progressCan, 'no-repeat')
}

let progressPattern
const can = document.getElementById('progress')
const ctx = can.getContext('2d')
can.width = 100
can.height = 10

function progressClear (color) {
  ctx.clearRect(0, 0, can.width, can.height)
}

function progressRender (p) {
  if (progressPattern) {
    ctx.fillStyle = progressPattern
    ctx.fillRect(0, Math.round((1.0 - p) * can.height), can.width, can.height)
  }
}
