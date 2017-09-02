const fs = require('fs');

fs.readFile('./partnersFile.json', (err, response) => {
  if (err) {
    throw err;
  }
  const partners = JSON.parse(response);
  const officeLat = 51.515419;
  const officeLong = -0.141099;
  const earthRadiusKm = 6371;
  let flattenedPartners = [];

  const toRad = num => {
    return num * Math.PI / 180;
  };

  const distanceFromOffice = (partnerLat, partnerLong) => {
    const dLat = toRad(partnerLat - officeLat);
    const dLong = toRad(partnerLong - officeLong);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(officeLat)) *
      Math.cos(toRad(partnerLat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return earthRadiusKm * c;
  };

  partners.forEach( partner => {
    const offices = partner.offices;

    if (offices.length > 1) {
      offices.forEach( office => {
        let dupPartner = {};

        for (let key in partner) {
          dupPartner[key] = (key === 'offices') ? [office] : partner[key];
        }
        flattenedPartners.push(dupPartner);
      });
    } else {
      flattenedPartners.push(partner);
    }
  });

  return flattenedPartners.filter( partner => {
    const coords = partner.offices[0].coordinates.split(',');
    const distanceInKm = distanceFromOffice(coords[0], coords[1]);

    return distanceInKm <= 100;
  })
  .sort( (partnerA, partnerB) => {
    return partnerA.organization - partnerB.organization;
  })
  .map( partner => {
    return ['Name: ' + partner.organization, ' Address: ' + partner.offices[0].address];
  })
  .join('\n');
});