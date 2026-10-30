import { getCliClient } from 'sanity/cli';

// Source: the biography and academic record supplied by the laboratory on 2026-10-30.
// DOI links were matched against the exact paper titles before publication.
const biography = 'Dr. Tonghui Ji is a researcher in optical communications at Great Bay University. Before joining GBU, he was a postdoctoral researcher at Pengcheng Laboratory and an optical technology research engineer at Huawei. He earned a Ph.D. in Communication and Information Systems from the University of Science and Technology Beijing in 2022 and undertook joint doctoral research at the University of Melbourne. His work spans short-reach, long-haul and space-division-multiplexed optical transmission, with a focus on system modeling, optical performance monitoring and digital signal processing. His research connects theory, algorithms, experiments and field deployment. He has published more than 60 papers in peer-reviewed journals and conferences and is a named inventor on nine patents and patent applications.';
const focus = 'Short-reach, long-haul and space-division-multiplexed optical transmission; system modeling; optical performance monitoring; digital signal processing.';

const records = [
  ['journal', 'Tonghui Ji, Zhaopeng Xu, Honglin Ji, et al. “Fast and Accurate QoT Prediction for SDM Networks via Analytical Modeling.” Journal of Lightwave Technology 43(24), 10863–10870 (2025).', 'https://doi.org/10.1109/JLT.2025.3621466'],
  ['journal', 'Tonghui Ji, Qi Wu, Zhaopeng Xu, et al. “Enhancing nonlinear compensation efficiency with multi-task neural networks for coherent optical systems.” Optics Express 33(15), 32417–32428 (2025).', 'https://doi.org/10.1364/OE.563931'],
  ['journal', 'Tonghui Ji, Chuanbowen Sun, Honglin Ji, et al. “Theoretical and Experimental Investigations of Interleaved Carrier-Assisted Differential Detection.” Journal of Lightwave Technology 39(1), 122–128 (2021).', 'https://doi.org/10.1109/JLT.2020.3025930'],
  ['journal', 'Tonghui Ji, Yunfeng Peng, Xingyun Xu, et al. “In-band OSNR monitoring for PDM-mQAM signals using directly detected Stokes parameters.” Optical Fiber Technology 61, 102425 (2021).', 'https://doi.org/10.1016/j.yofte.2020.102425'],
  ['journal', 'Tonghui Ji, Yunfeng Peng, Guojun Zhu. “In-Band OSNR Monitoring From Stokes Parameters Using Support Vector Regression.” IEEE Photonics Technology Letters 31(5), 385–388 (2019).', 'https://doi.org/10.1109/LPT.2019.2896033'],
  ['journal', 'Hum Nath Parajuli, Tonghui Ji, Xinping Wang, et al. “Low-complexity mitigation of multipath interference in PAM-4 IM/DD systems via recursive filtering.” Optics Express 34(10), 19214–19229 (2026).', 'https://doi.org/10.1364/OE.595885'],
  ['journal', 'Chuanbowen Sun, Tonghui Ji, Honglin Ji, et al. “Experimental Demonstration of Complex-Valued DSB Signal Field Recovery via Direct Detection.” IEEE Photonics Technology Letters 32, 585–588 (2020).', 'https://doi.org/10.1109/LPT.2020.2985590'],
  ['conference', 'Zhaopeng Xu, Tonghui Ji, Qi Wu, et al. “Neural architecture search for optimized nonlinearity compensation in coherent optical fiber systems.” CLEO 2026, JW1.80.', 'https://doi.org/10.1364/CLEO_AT.2026.JW1.80'],
  ['conference', 'Tonghui Ji, Qi Wu, Zhaopeng Xu, et al. “Multi-Task Learning: Towards Low-Complexity Neural Network Nonlinearity Compensation in Coherent Optical Systems.” ACP 2024.', 'https://doi.org/10.1109/ACP/IPOC63121.2024.10809684'],
  ['conference', 'Tonghui Ji, Qi Wu, Zhaopeng Xu, et al. “Fast and Accurate Estimation of MDL-Induced SNR Penalty in SDM Link with Non-uniform Noise Loading.” ACP 2024.', 'https://doi.org/10.1109/ACP/IPOC63121.2024.10809984'],
  ['conference', 'Tonghui Ji, Chuanbowen Sun, Honglin Ji, et al. “Field Recovery at Low CSPR Using Interleaved Carrier Assisted Differential Detection.” OFC 2020, W4A.3.', 'https://doi.org/10.1364/OFC.2020.W4A.3'],
  ['conference', 'Honglin Ji, Tonghui Ji, Chuanbowen Sun, et al. “Four-Dimensional Direct Detection Receiver Based on Stokes Vector and Differential Polarization Inner Product.” ACP 2020.', 'https://doi.org/10.1364/ACPC.2020.T1B.1'],
  ['patent', '吉同晖、许兆鹏、计红林等，《信号处理方法、装置、设备、存储介质及计算机程序产品》，申请号 202510606077.1，申请日 2025-05-12，公开号 CN120541602A。'],
  ['patent', '邓宁、吉同晖、胡姆·纳特·帕拉朱利，《光通信信号处理方法及装置》，申请号 202610672947.X，申请日 2026-05-15，公开号 CN122339568A。'],
  ['patent', '许兆鹏、吉同晖、张旭等，《光通信中信号补偿方法、装置、设备及介质》，申请号 202610250016.0，申请日 2026-03-03，公开号 CN122052913A。'],
  ['patent', '许兆鹏、吉同晖、计红林等，《空分复用系统的非线性损伤信号处理方法及装置》，申请号 202411664065.6，申请日 2024-11-20，公开号 CN119583265A。', 'https://patents.google.com/patent/CN119583265A/zh'],
  ['patent', '郭强、吉同晖、甘霖，《一种光信号调制和监测方法及相关装置》，申请号 202211171733.2，申请日 2022-09-23，公开号 CN117768027A。', 'https://patents.google.com/patent/CN117768027A/zh'],
  ['patent', '彭云峰、吉同晖，《一种光信噪比监测装置及监测方法》，申请号 201910017755.5，申请日 2019-01-08，公开号 CN109474336A。', 'https://patents.google.com/patent/CN109474336A/zh'],
  ['patent', '甘霖、郭强、吉同晖，《一种光检测设备、光发射机、检测方法及通信方法》，申请号 202311796311.9，申请日 2023-12-22，公开号 CN120200664A。']
].map(([kind, citation, url], index) => ({
  _type: 'academicRecord', _key: `ji-record-${index + 1}`, kind, citation,
  ...(url ? { url } : {}), language: kind === 'patent' ? 'zh' : 'en'
}));

const researchProjects = [{
  _type: 'researchProject', _key: 'ji-project-2025',
  title: '基于广义 Stokes 矢量的少模光纤现网系统损伤机理与监测研究',
  year: 2025, note: '博士后面上基金 · 主持', language: 'zh'
}];

async function main() {
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ dataset: 'production' });
  const id = 'person-ji-tonghui';
  const person = await client.getDocument(id);
  if (!person || person.name !== 'Tonghui Ji') throw new Error('The expected Tonghui Ji record was not found.');
  if (person.academicRecords?.length || person.researchProjects?.length || person.biography) {
    throw new Error('The profile now contains records; review them manually before replacing anything.');
  }
  await client.patch(id).ifRevisionId(person._rev).set({ biography, focus, academicRecords: records, researchProjects }).commit();
  console.log(`Updated ${id}: ${records.length} academic records and ${researchProjects.length} project.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
