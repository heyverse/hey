import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';

export const mainnetVerified = [
  '0xe239', // okytomo.lens
  '0x017597', // gitcoin.lens
  '0x8396', // alphaplease.lens
  '0xeca7', // ethdaily.lens
  '0x016ea6', // afriedman.lens
  '0x016b2d', // mikeshinoda.lens
  '0x01067e', // jlindsayfilm.lens
  '0xf4f5', // laurenturton.lens
  '0xeb6f', // doobzee.lens
  '0x3093', // sophiest.lens
  '0xee84', // mintedmojito.lens
  '0x014ea2', // miguelberpu.lens
  '0x013cee', // gotenks.lens
  '0x2e2a', // dheerajshah.lens
  '0xe5cc', // alarke.lens
  '0x012d4e', // connectthecoast.lens
  '0x8eaf', // leli_j.lens
  '0x6871', // zombieshepherd.lens
  '0xee8b', // waltz.lens
  '0x0fa1', // ittai.lens
  '0xe508', // noahnft.lens
  '0xa68c', // juampi.lens
  '0x011a73', // tropix.lens
  '0x016463', // romellhenry.lens
  '0x015e00', // dylanh.lens
  '0x016b43', // ethereum.lens
  '0xd543', // mirran.lens
  '0x012ba5', // pooltogether.lens
  '0xb17c', // perpetual.lens
  '0x0ac7', // hayden.lens
  '0x1bdd', // arnauramio.lens
  '0x1f28', // 0xmaki.lens
  '0x1d58', // guild.lens
  '0x2c66', // alexadelman.lens
  '0xdd33', // zkjew.lens
  '0xb087', // akiba.lens
  '0x8dbc', // blackdave.lens
  '0xd63c', // cryptoslate.lens
  '0x20ed', // colors.lens
  '0x1c1b', // boysclub.lens
  '0x3824', // cryptotesters.lens
  '0x2aab', // developerdao.lens
  '0x8623', // mintsongs.lens
  '0xb493', // niftycomedians.lens
  '0xb1ff', // jackmcdermott.lens
  '0x0207', // welook.lens
  '0x08f8', // thanasi.lens
  '0x5881', // nilesh.lens
  '0x2d44', // coderdan.lens
  '0x14f5', // jierlich.lens
  '0x7d', // liquidfire.lens
  '0xf857', // masknetworkofficial.lens
  '0xf1b1', // millionrecords.lens
  '0xc4c2', // arachnid.lens
  '0x7901', // klima.lens
  '0x0c67', // toucanprotocol.lens
  '0x1c5f', // allmylovezoe.lens
  '0xe06b', // operacrypto.lens
  '0x250e', // alexatallah.lens
  '0xdf7a', // cms_intern.lens
  '0xdf89', // fingacode.lens
  '0x016e', // hazelstar.lens
  '0x2a05', // lolli.lens
  '0x2292', // lobsterdao.lens
  '0xdf88', // umaproject.lens
  '0xcea6', // dappnode.lens
  '0xdf85', // acrossbridge.lens
  '0x0b89', // catalog.lens
  '0xce63', // ethcatherders.lens
  '0x2e1b', // alwaysonline.lens
  '0x2d0d', // asian.lens
  '0x1f9e', // ellie.lens
  '0x8dec', // thisisvoya.lens
  '0x010a', // penryn.lens
  '0x0749', // superphiz.lens
  '0xce6d', // paladin.lens
  '0xa1e3', // hedgiesofficial.lens
  '0x0ace', // rehash.lens
  '0x0ce1', // levychain.lens
  '0x0e01', // shl0ms.lens
  '0x0870', // gcr__.lens
  '0x07c7', // moongotchi.lens
  '0xad5d', // zerion.lens
  '0xc0dc', // yearn.lens
  '0xb289', // harvest.lens
  '0xad1e', // apwine.lens
  '0xb400', // jarvis.lens
  '0xb27a', // mtpelerin.lens
  '0x8cb6', // makerdao.lens
  '0xbca0', // defibasket.lens
  '0xac', // dydymoon.lens
  '0xb17c', // perpetual.lens
  '0x0352', // gmoney.lens
  '0xb28e', // beefyfinance.lens
  '0xb821', // boyfriend.lens
  '0x0c7e', // corbin.lens
  '0x25f1', // gelato.lens
  '0x2816', // cryptoguicci.lens
  '0x2c6d', // shefi.lens
  '0x2e09', // defidad.lens
  '0x1ef0', // lefteris.lens
  '0x0f30', // thewayloveworks.lens
  '0x30fb', // debridge.lens
  '0x8d94', // josephdelong.lens
  '0x0d31', // irisapp.lens
  '0x5b5b', // karmawav.lens
  '0x09f1', // xinobi.lens
  '0x2057', // refraction.lens
  '0x1ed2', // dcbuilder.lens
  '0x0f83', // ddwchen.lens
  '0x0dcf', // santi.lens
  '0x8635', // teaparty.lens
  '0x1053', // finematics.lens
  '0x1c19', // gabriel.lens
  '0x8e79', // primary.lens
  '0x011d', // aavechan.lens
  '0x8b61', // bankless.lens
  '0x8690', // pussyriotxyz.lens
  '0x6417', // blockworks.lens
  '0x1eb8', // kartik.lens
  '0x5138', // fabien.lens
  '0x3498', // sassal.lens
  '0x2e02', // rabbithole.lens
  '0x3479', // aavegotchi.lens
  '0x2f70', // owocki.lens
  '0x20c6', // coopahtroopa.lens
  '0x2e0a', // sandeep.lens
  '0x228d', // wongmjane.lens
  '0x28a2', // nader.lens
  '0x266b', // ryansadams.lens
  '0x25f3', // opensea.lens
  '0x26e5', // sismo.lens
  '0x23ac', // devpillme.lens
  '0xf5', // m1guelpf.lens
  '0xcc', // indexcoop.lens
  '0x1cef', // trustlessstate.lens
  '0x38', // cashmere.lens
  '0x0210', // paris.lens
  '0x0160', // ethglobal.lens
  ...aaveMembers,
  ...lensterMembers
];

export const testnetVerified = [
  '0x15', // yoginth.test,
  '0x01', // lensprotocol.test,
  '0x02' // donosonaumczuk.test
];
