import React from 'react'
import { Link } from 'gatsby'
import mapboxgl from 'mapbox-gl'

import Layout from '../components/layout'
import Image from '../components/image'
import './mapbox.css'

let geojson = {
  type: 'Feature',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [139.7620094, 35.7144598]
    },
    properties: {
      title: '東京大学本郷キャンパス工学部２号館',
      description: 'ごみ箱A'
    }
  },{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [139.6537, 35.5553]
    },
    properties: {
      title: '矢上キャンパス',
      description: 'ごみ箱B'
    }
  },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.7765738, 35.6298168]
      },
      properties: {
        title: 'お台場',
        description: 'ごみ箱C'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.794386, 35.717031]
      },
      properties: {
        title: '浅草',
        description: 'ごみ箱D'
      }
    }, 
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.7407489, 35.6489643]
      },
      properties: {
        title: '三田キャンパス',
        description: 'ごみ箱E'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6201245, 35.4657858]
      },
      properties: {
        title: '横浜駅',
        description: 'ごみ箱F'
      }
    },  
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6480999, 35.5525811]
      },
      properties: {
        title: '日吉キャンパス',
        description: 'ごみ箱G'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.5747086, 35.5904462]
      },
      properties: {
        title: '宮前平小学校',
        description: 'ごみ箱H'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.4257731, 35.3883839]
      },
      properties: {
        title: '湘南藤沢キャンパス',
        description: 'ごみ箱I'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6926152,35.5383874]
      },
      properties: {
        title: '多摩川緑園野球場',
        description: 'ごみ箱J'
      }
    }, 
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6794458, 35.6050403]
      },
      properties: {
        title: '東工大',
        description: 'ごみ箱K'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6418233, 35.4577862]
      },
      properties: {
        title: '横浜スタジアム',
        description: 'ごみ箱L'
      }
    },  
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.7163732, 35.6753286]
      },
      properties: {
        title: '神宮外苑前球場',
        description: 'ごみ箱M'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6829559,35.6324317]
      },
      properties: {
        title: '東京学芸大学附属高等学校',
        description: 'ごみ箱N'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6720576, 35.6048512]
      },
      properties: {
        title: '自由が丘駅',
        description: 'ごみ箱O'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.5919026,35.5365429]
      },
      properties: {
        title: 'せせらぎ公園',
        description: 'ごみ箱P'
      }
    }, 
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6424153,35.5904282]
      },
      properties: {
        title: '多摩川河川敷',
        description: 'ごみ箱Q'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.7098104, 35.6256998]
      },
      properties: {
        title: '都立 林試の森公園',
        description: 'ごみ箱R'
      }
    },  
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.703931, 35.6012754]
      },
      properties: {
        title: '武蔵小山温泉 清水湯',
        description: 'ごみ箱S'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.552034, 35.4389657]
      },
      properties: {
        title: '上品濃公園',
        description: 'ごみ箱T'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.5241031, 35.3770076]
      },
      properties: {
        title: '飯田牧場',
        description: 'ごみ箱U'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6171604, 35.4818888]
      },
      properties: {
        title: '岸根公園',
        description: 'ごみ箱V'
      }
    }, 
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.6614936, 35.5319385]
      },
      properties: {
        title: '鶴見川沿い',
        description: 'ごみ箱W'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.7536636, 35.7061412]
      },
      properties: {
        title: '水道橋駅',
        description: 'ごみ箱X'
      }
    },  
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.7620281, 35.7047948]
      },
      properties: {
        title: '上野動物園',
        description: 'ごみ箱Y'
      }
    },  
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [139.7208951, 35.6085269]
      },
      properties: {
        title: '戸越南公園',
        description: 'ごみ箱Z'
      }
    }]
}

let markers = {} 

class IndexPage extends React.Component {
  createMap() {
    const zoom = 18
    const coordinates = [139.7620094, 35.7144598]
    const map = new mapboxgl.Map({
      center: coordinates,
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      zoom: zoom,
    })

    map.on('load', () => {
      // add markers to map
      geojson.features.forEach(function(markerInfo) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';
        el.classList.add('empty')
        // こんな感じでidを分けてCSSを管理する
        // el.id = 'empty';

        // make a marker for each feature and add to the map
        markers[markerInfo.properties.title] = new mapboxgl.Marker(el)
          .setLngLat(markerInfo.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML('<h3>' + markerInfo.properties.title + '</h3><p>' + markerInfo.properties.description + '</p>'))
          .addTo(map);
      })
    })
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1bmtpbiIsImEiOiJjam9qcWlqZWYwM3pvM3BxbzY2MHVwcDhiIn0.Ne4nnKeFzoY8QF4k61EWng'
    this.createMap()
  }

  render() {
    return (
      <Layout>
        <div id={'map'} style={{width: '100%', height: '500'}}/>
      </Layout>
    )
  }
}

export default IndexPage
