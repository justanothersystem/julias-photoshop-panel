import '../sass/main.scss'

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

s3.listObjects({
  Bucket: bucketName,
  MaxKeys: 10
}, (err, data) => {
  if (err) {
    console.error(err)
  } else {
    console.log(data)

    const images = []

    data.Contents.forEach((d) => {
      images.push(d.Key)
    })

    const urls = images.map((key) => {
      return `https://s3.amazonaws.com/${bucketName}/${key}`
    })

    console.log(urls)

    urls.forEach(addImage)

  }
})

function addImage (url) {
  const img = new window.Image()
  img.src = url
  document.getElementById('images').appendChild(img)
}

document.getElementById('refresh').onclick = () => {
  window.location.reload()
}
