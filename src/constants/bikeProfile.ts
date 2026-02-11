import { BikeProfile } from '../types';

export const BIKE_PROFILE: BikeProfile = {
  nickname: 'Virginia',
  year: 2004,
  make: 'Harley-Davidson',
  model: 'Road King Police',
  modelCode: 'FLHP-I',
  vin: '1HD1FHW184Y702588',
  buildSheet: {
    CHASSIS: [
      'Frame: Touring steel frame (Police spec)',
      'Rear Suspension: Burley 10.5” shocks',
      'Seat: Standard 2-up',
      'Saddlebags: Police standard hard bags',
      'Brakes: Dual front / single rear — DOT 5',
      'Final Drive: Belt'
    ],
    ENGINE: [
      'Twin Cam 88',
      '1450cc',
      'Air-cooled',
      'Upgraded high-flow oil system',
      'Major engine service at ~22,900 miles'
    ],
    'VALVE TRAIN & CAM CHEST': [
      'Fueling 525 cams',
      'Hydraulic tensioners',
      'New cam bearings',
      'New chains & sprockets',
      'High-flow oil pump',
      'Adjustable pushrods',
      'Lifters replaced'
    ],
    'INTAKE & EXHAUST': [
      'High-flow intake',
      'S&S head pipes',
      'SVT BoneShakers',
      'Free-flowing exhaust'
    ],
    FUELING: [
      'Delphi EFI',
      'Dynojet Power Commander VI + AutoTune',
      'Fuel Moto tune',
      'Dyno verified 100 HP'
    ],
    TRANSMISSION: [
      '5-speed',
      'New shift shaft seal',
      'Primary gaskets replaced',
      'Drive shaft seals replaced'
    ]
  },
  milestone: 'Major cam chest / engine work completed at 22,900 miles.'
};
