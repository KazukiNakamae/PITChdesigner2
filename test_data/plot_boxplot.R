## You can use the below code to generate the graph.
## Don't forget to replace the 'df' with the name
## of your dataframe

feature.class.result <- read.csv('/Users/kazuki/GitHub/PITChdesigner2/test_data/MaChIAtoKI_result_from_SupFig8_data.csv', header=TRUE, sep=",")

# You need the following package(s):
library("ggplot2")

# The code below will generate the graph:
graph <- ggplot(feature.class.result, aes(x = Annotation, y = Precise.knock.in, colour = Annotation)) +
  geom_boxplot(notch = FALSE, outlier.colour = NA) +
  geom_jitter(size = 1, alpha = 0.5, width = 0.25, colour = 'black')+
  scale_colour_brewer(palette = 'Set1') +
  theme_bw()
graph

# If you would like to save your graph, you can use:
setwd("/Users/kazuki/GitHub/PITChdesigner2/test_data")
ggsave('feature.class.result.pdf', graph, dpi = 350, width = 14, height = 14, units = 'cm')

library("dplyr")
Desirable <- feature.class.result %>% filter(Annotation == "Desirable")
No <- feature.class.result %>% filter(Annotation == "No")
Undesirable <- feature.class.result %>% filter(Annotation == "Undesirable")

# > nrow(Desirable)
# [1] 11
# > nrow(No)
# [1] 12
# > nrow(Undesirable)
# [1] 17


t.test(No$Precise.knock.in, Desirable$Precise.knock.in, var.equal = FALSE)
# 	Welch Two Sample t-test
# data:  No$Precise.knock.in and Desirable$Precise.knock.in
# t = -2.6381, df = 14.486, p-value = 0.01905
# alternative hypothesis: true difference in means is not equal to 0
# 95 percent confidence interval:
#  -9.575300 -1.002446
# sample estimates:
# mean of x mean of y 
#   6.22177  11.51064 

t.test(No$Precise.knock.in, Undesirable$Precise.knock.in, var.equal = FALSE)
# 	Welch Two Sample t-test

# data:  No$Precise.knock.in and Undesirable$Precise.knock.in
# t = 1.3629, df = 23.24, p-value = 0.186
# alternative hypothesis: true difference in means is not equal to 0
# 95 percent confidence interval:
#  -0.7892707  3.8428550
# sample estimates:
# mean of x mean of y 
#  6.221770  4.694978 

