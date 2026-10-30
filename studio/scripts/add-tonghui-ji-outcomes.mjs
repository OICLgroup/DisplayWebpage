import { getCliClient } from 'sanity/cli';

// Source: Tonghui Ji's CV supplied on 2026-10-30. DOI matches were checked
// against the exact publication titles. The shared Parajuli et al. paper is
// already present as publication-parajuli-recursive-filtering-2026.
const publications = [
  {
    _id: 'publication-ji-qot-sdm-2025',
    title: 'Fast and Accurate QoT Prediction for SDM Networks via Analytical Modeling',
    authors: 'T. Ji, Z. Xu, H. Ji, et al.', year: 2025,
    venue: 'Journal of Lightwave Technology, 43(24), 10863–10870', type: 'Journal',
    doi: '10.1109/JLT.2025.3621466'
  },
  {
    _id: 'publication-ji-multitask-nonlinear-2025',
    title: 'Enhancing nonlinear compensation efficiency with multi-task neural networks for coherent optical systems',
    authors: 'T. Ji, Q. Wu, Z. Xu, et al.', year: 2025,
    venue: 'Optics Express, 33(15), 32417–32428', type: 'Journal',
    doi: '10.1364/OE.563931'
  },
  {
    _id: 'publication-ji-interleaved-detection-2021',
    title: 'Theoretical and Experimental Investigations of Interleaved Carrier-Assisted Differential Detection',
    authors: 'T. Ji, C. Sun, H. Ji, et al.', year: 2021,
    venue: 'Journal of Lightwave Technology, 39(1), 122–128', type: 'Journal',
    doi: '10.1109/JLT.2020.3025930'
  },
  {
    _id: 'publication-ji-osnr-pdm-mqam-2021',
    title: 'In-band OSNR monitoring for PDM-mQAM signals using directly detected Stokes parameters',
    authors: 'T. Ji, Y. Peng, X. Xu, et al.', year: 2021,
    venue: 'Optical Fiber Technology, 61, 102425', type: 'Journal',
    doi: '10.1016/j.yofte.2020.102425'
  },
  {
    _id: 'publication-ji-osnr-stokes-2019',
    title: 'In-Band OSNR Monitoring From Stokes Parameters Using Support Vector Regression',
    authors: 'T. Ji, Y. Peng, G. Zhu', year: 2019,
    venue: 'IEEE Photonics Technology Letters, 31(5), 385–388', type: 'Journal',
    doi: '10.1109/LPT.2019.2896033'
  },
  {
    _id: 'publication-ji-dsb-field-recovery-2020',
    title: 'Experimental Demonstration of Complex-Valued DSB Signal Field Recovery via Direct Detection',
    authors: 'C. Sun, T. Ji, H. Ji, et al.', year: 2020,
    venue: 'IEEE Photonics Technology Letters, 32, 585–588', type: 'Journal',
    doi: '10.1109/LPT.2020.2985590'
  },
  {
    _id: 'publication-ji-neural-search-cleo-2026',
    title: 'Neural architecture search for optimized nonlinearity compensation in coherent optical fiber systems',
    authors: 'Z. Xu, T. Ji, Q. Wu, et al.', year: 2026,
    venue: 'CLEO 2026, JW1.80', type: 'Conference',
    doi: '10.1364/CLEO_AT.2026.JW1.80'
  },
  {
    _id: 'publication-ji-multitask-acp-2024',
    title: 'Multi-Task Learning: Towards Low-Complexity Neural Network Nonlinearity Compensation in Coherent Optical Systems',
    authors: 'T. Ji, Q. Wu, Z. Xu, et al.', year: 2024,
    venue: 'Asia Communications and Photonics Conference (ACP), pp. 1–4', type: 'Conference',
    doi: '10.1109/ACP/IPOC63121.2024.10809684'
  },
  {
    _id: 'publication-ji-mdl-snr-acp-2024',
    title: 'Fast and Accurate Estimation of MDL-Induced SNR Penalty in SDM Link with Non-uniform Noise Loading',
    authors: 'T. Ji, Q. Wu, Z. Xu, et al.', year: 2024,
    venue: 'Asia Communications and Photonics Conference (ACP), pp. 1–4', type: 'Conference',
    doi: '10.1109/ACP/IPOC63121.2024.10809984'
  },
  {
    _id: 'publication-ji-low-cspr-ofc-2020',
    title: 'Field Recovery at Low CSPR Using Interleaved Carrier Assisted Differential Detection',
    authors: 'T. Ji, C. Sun, H. Ji, et al.', year: 2020,
    venue: 'Optical Fiber Communication Conference (OFC), W4A.3', type: 'Conference',
    doi: '10.1364/OFC.2020.W4A.3'
  },
  {
    _id: 'publication-ji-four-dimensional-acp-2020',
    title: 'Four-Dimensional Direct Detection Receiver Based on Stokes Vector and Differential Polarization Inner Product',
    authors: 'H. Ji, T. Ji, C. Sun, et al.', year: 2020,
    venue: 'Asia Communications and Photonics Conference (ACP), T1B.1', type: 'Conference',
    doi: '10.1364/ACPC.2020.T1B.1'
  }
];

async function main() {
  const client = getCliClient({ apiVersion: '2026-10-01' }).withConfig({ dataset: 'production' });
  const existing = await client.fetch('*[_type == "publication" && defined(doi)]{_id,doi}');
  const knownDoi = new Set(existing.map((item) => item.doi.toLowerCase()));
  for (const item of publications) {
    if (knownDoi.has(item.doi.toLowerCase())) {
      console.log(`Already listed: ${item.doi}`);
      continue;
    }
    await client.createIfNotExists({ _type: 'publication', ...item, language: 'en', featured: false });
    knownDoi.add(item.doi.toLowerCase());
    console.log(`Added: ${item._id}`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
