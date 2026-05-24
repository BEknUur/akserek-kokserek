'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Клич',
    titleKz: 'Шақыру',
    desc: 'Команда кричит: «Ақсерек, көксерек, бізден сізге кім керек?» и вызывает игрока противника',
    mark: 'I',
  },
  {
    num: '02',
    title: 'Прорыв',
    titleKz: 'Жарып өту',
    desc: 'Вызванный игрок бежит и пытается разорвать цепь рук. Попади в нужный момент — нажми ПРОБЕЛ!',
    mark: 'II',
  },
  {
    num: '03',
    title: 'Плен или победа',
    titleKz: 'Тұтқын немесе жеңіс',
    desc: 'Прорвал — забираешь игрока. Не прорвал — сам переходишь в плен. Побеждает команда, забравшая всех!',
    mark: 'III',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Rules() {
  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-[var(--steppe-gold)] font-kazakh text-sm tracking-widest uppercase mb-2">
          Ережелер
        </p>
        <h2 className="font-title text-3xl md:text-4xl text-white">
          Как играть
        </h2>
        <div className="mt-3 mx-auto w-24 h-0.5 bg-[var(--steppe-gold)]/50" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {steps.map((step) => (
          <motion.div
            key={step.num}
            variants={cardVariants}
            className="relative bg-[var(--ui-bg)] border border-[var(--steppe-gold)]/30 rounded-lg p-6 text-center"
          >
            {/* Номер шага */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--steppe-gold)] text-[#0a0e1a] font-title text-xs font-bold px-3 py-1 rounded">
              {step.num}
            </div>

            <div className="mx-auto mb-5 mt-3 grid h-14 w-14 place-items-center border border-[var(--steppe-gold)]/60 text-[var(--steppe-gold)]">
              <span className="font-title text-lg">{step.mark}</span>
            </div>

            <h3 className="font-title text-white text-lg mb-1">{step.title}</h3>
            <p className="font-kazakh text-[var(--steppe-gold)] text-xs mb-3">{step.titleKz}</p>
            <p className="text-gray-300 text-sm font-body leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
